const User = require("../model/userModel");
const Cart = require("../model/cartModel");
const Address = require("../model/addressModel");
const Product = require("../model/productsModel");
const Order = require("../model/ordersModel");
const Coupon = require("../model/couponsModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

//-------------------- RAZORPAY INSTENCE ------------

var instance = new Razorpay({
  key_id: process.env.RazorId,
  key_secret: process.env.RazorKey,
});

//---------------------PLACE ORDER WITH COD-----------

const orderPlace = async (req, res) => {
  try {
    const id = req.session.user_id;
    const address = req.body.address;
    const cartData = await Cart.findOne({ userId: id });
    const products = cartData.products;
    const total = parseInt(req.body.Total);
    const paymentMethods = req.body.payment;
    const userData = await User.findOne({ _id: id });
    const name = userData.name;
    const uniNum = Math.floor(Math.random() * 900000) + 100000;
    const walletBalance = userData.wallet;
    const code = req.body.code;
    //user limit decreasing
    await Coupon.updateOne({ couponCode: code }, { $inc: { usersLimit: -1 } });
    //user name adding
    await Coupon.updateOne(
      { couponCode: code },
      { $push: { usedUsers: req.session.user_id } }
    );

    const order = new Order({
      deliveryDetails: address,
      uniqueId: uniNum,
      userId: id,
      userName: name,
      paymentMethod: paymentMethods,
      products: products,
      totalAmount: total,
      date: new Date(),
    });
    const orderData = await order.save();
    const orderid = order._id;

    if (orderData) {
      //--------------------CASH ON DELIVERY-------------------//
      if (order.paymentMethod === "COD") {
        await Cart.deleteOne({ userId: req.session.user_id });
        for (let i = 0; i < products.length; i++) {
          const pro = products[i].productId;
          const count = products[i].count;
          await Product.findOneAndUpdate(
            { _id: pro },
            { $inc: { quantity: -count } }
          );
        }
        if (req.session.code) {
          const coupon = await Coupon.findOne({ couponCode: req.session.code });
          const disAmount = coupon.discountAmount;
          await Order.updateOne(
            { _id: orderid },
            { $set: { discount: disAmount } }
          );
          res.json({ codsuccess: true, orderid });
        }
        res.json({ codsuccess: true, orderid });
      } else {
        //-------------IF THE ORDER IS NOT COD-----------------//

        const orderId = orderData._id;
        const totalAmount = orderData.totalAmount;

        //---------------PAYMENT USING WALLET------------------//

        if (order.paymentMethod == "wallet") {
          if (walletBalance >= total) {
            const result = await User.findOneAndUpdate(
              { _id: id },
              {
                $inc: { wallet: -total },
                $push: {
                  walletHistory: {
                    date: new Date(),
                    amount: total,
                    reason: "Purchaced Amount Debited.",
                    direction:"Debited"
                  },
                },
              },
              { new: true }
            );

            if (result) {
              console.log("amount debited from wallet");
            } else {
              console.log("not debited from wallet");
            }
            await Cart.deleteOne({ userId: req.session.user_id });
            for (let i = 0; i < products.length; i++) {
              const pro = products[i].productId;
              const count = products[i].count;
              await Product.findOneAndUpdate(
                { _id: pro },
                { $inc: { quantity: -count } }
              );
            }
            if (req.session.code) {
              const coupon = await Coupon.findOne({
                couponCode: req.session.code,
              });
              const disAmount = coupon.discountAmount;
              await Order.updateOne(
                { _id: orderid },
                { $set: { discount: disAmount } }
              );
              res.json({ codsuccess: true, orderid });
            }

            res.json({ codsuccess: true, orderid });
          } else {
            res.json({ walletFailed: true });
          }

          //--------------IF PAYMENT THROUGH RAZORPAY-------------//
        } else if (order.paymentMethod == "onlinePayment") {
          var options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: "" + orderId,
          };

          instance.orders.create(options, function (err, order) {
            res.json({ order });
          });
        }
      }
    } else {
      console.log("not added");
    }
  } catch (error) {
    console.error(error);
    res.render("500");
  }
};

//--------------- VERIFY PAYMENT ------------------

const verifyPayment = async (req, res) => {
  try {
    const cartData = await Cart.findOne({ userId: req.session.user_id });
    const products = cartData.products;
    const details = req.body;
    const hmac = crypto.createHmac("sha256", process.env.RazorKey);

    hmac.update(
      details.payment.razorpay_order_id +
        "|" +
        details.payment.razorpay_payment_id
    );
    const hmacValue = hmac.digest("hex");

    if (hmacValue === details.payment.razorpay_signature) {
      for (let i = 0; i < products.length; i++) {
        const pro = products[i].productId;
        const count = products[i].count;
        await Product.findByIdAndUpdate(
          { _id: pro },
          { $inc: { quantity: -count } }
        );
      }

      await Order.findByIdAndUpdate(
        { _id: details.order.receipt },
        { $set: { paymentId: details.payment.razorpay_payment_id } }
      );
      await Cart.deleteOne({ userId: req.session.user_id });
      const orderid = details.order.receipt;

      //----discount adding orderDB------//
      if (req.session.code) {
        const coupon = await Coupon.findOne({ couponCode: req.session.code });
        const disAmount = coupon.discountAmount;
        await Order.updateOne(
          { _id: orderid },
          { $set: { discount: disAmount } }
        );
        res.json({ codsuccess: true, orderid });
      }
      res.json({ codsuccess: true, orderid });
    } else {
      await Order.findByIdAndRemove({ _id: details.order.receipt });
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
    
  }
};

//-----------------ORDER SUCCESS PAGE-------------

const successPage = async (req, res) => {
  try {

    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }
    const user = await User.findOne({ _id: req.session.user_id });
        const wishlist = user.wishlist.items;
        let wishCount = 0
        if(wishlist){
          wishCount = wishlist.length;
        }
    res.render("successPage", { name: req.session.name, cartCount ,wishCount});
  } catch (error) {
    console.error(error);
    res.status(500).render("500")
  }
};

//-----------------------ORDER MANAGEMENT PAGE IN ADMIN SIDE-----------

const ordermanagementpage = async (req, res) => {
  try {
    const orderData = await Order.find().sort({ date: -1 });
    res.render("ordermanagement", { orderData });
  } catch (error) {
    console.error(error);
    res.status(500).render("500")
  }
};

//------------------ORDER DETALS PAGE  IN ADMIN SIDE-------------

const orderDetailsPage = async (req, res) => {
  try {
    const uniqueId = req.query.id;
    const orderData = await Order.findOne({ uniqueId: uniqueId });
    const userId = orderData.userId;
    const addressId = orderData.deliveryDetails.trim();
    const addressData = await Address.findOne(
      { user: userId },
      { address: { $elemMatch: { _id: addressId } } }
    );
    const deliveryData = addressData.address[0]; // Get the first element of the array

    res.render("orderdetailspage", { orderData, deliveryData });
  } catch (error) {
    console.error(error);
    res.status(500).render("500")
  }
};

//-----------------------ORDER DETAILSE PAGE IN USER SIDE----------------

const orderDetailsPageUserside = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }
    const user = await User.findOne({ _id: req.session.user_id });
        const wishlist = user.wishlist.items;
        let wishCount = 0
        if(wishlist){
          wishCount = wishlist.length;
        }
    const uniqueId = req.query.id;
    const orderData = await Order.findOne({ uniqueId: uniqueId });
    const userId = orderData.userId;
    const addressId = orderData.deliveryDetails.trim();
    const deliverdProduct = orderData.products.filter(
      (product) => product.status == "Delivered"
    );
    const addressData = await Address.findOne(
      { user: userId },
      { address: { $elemMatch: { _id: addressId } } }
    );
    const deliveryData = addressData.address[0];

    res.render("orderdetailsUserside", {
      cartCount,
      wishCount,
      deliveryData,
      orderData,
      deliverdProduct,
    });
  } catch (error) {
    console.log(error)
    res.status(500).render("500")
  }
};

//---------------------------ORDER STATUS CHANGING-------------------------

const statusChanging = async (req, res) => {
  try {
    const uniqueId = req.body.uniqueId;
    const statusVal = req.body.num;
    const proId = req.body.id;

    let result;
    if (statusVal == 1) {
      result = await Order.updateOne(
        { uniqueId: uniqueId, "products.productId": proId },
        {
          $set: {
            "products.$.status": "Shipped",
          },
        }
      );
    } else if (statusVal == 2) {
      result = await Order.updateOne(
        { uniqueId: uniqueId, "products.productId": proId },
        {
          $set: {
            "products.$.status": "Placed",
          },
        }
      );
    } else if (statusVal == 3) {
      result = await Order.updateOne(
        { uniqueId: uniqueId, "products.productId": proId },
        {
          $set: {
            "products.$.status": "Out for delivery",
          },
        }
      );
    } else if (statusVal == 4) {
      result = await Order.updateOne(
        { uniqueId: uniqueId, "products.productId": proId },
        {
          $set: {
            "products.$.status": "Delivered",
          },
        }
      );
    }
    if (result) {
      // Successfully updated
      res.json({ success: true });
    } else {
      // No matching document found
      console.log("not updated");
      return res.status(404);
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500")
  }
};

//--------------------------- CANCELL ORDER ---------------------

const cancellOrder = async (req, res) => {
  try {
    const proId = req.query.id;
    const count = req.query.count;
    const uniqueId = req.query.uniqueId;
    const amount = req.query.amount;
    const id = req.session.user_id;
    const orderData = Order.findOne({ uniqueId: uniqueId });

    if (orderData.paymentMethod !== "COD") {
      const result = await User.findOneAndUpdate(
        { _id: id },
        {
          $inc: { wallet: amount },
          $push: {
            walletHistory: {
              date: new Date(),
              amount: amount,
              reason: "Cancelled Product Amount Credited",
              direction:"Credited"
            },
          },
        },
        { new: true }
      );

      if (result) {
        console.log(`Added ${amount} to the wallet.`);
      } else {
        console.log("User not found.");
      }
      const updatedData = await Order.updateOne(
        { uniqueId: uniqueId, "products.productId": proId },
        {
          $set: {
            "products.$.status": "cancelled",
          },
        }
      );

      await Product.findOneAndUpdate(
        { _id: proId },
        { $inc: { quantity: count } }
      );

      if (updatedData) {
        console.log("order status updated to cancel");
      } else {
        console.log("order status not updated");
      }
      console.log("User wallet updated successfully.");
      res.json({ success: true });
    } else if (orderData.paymentMethod == "COD") {
      await Order.updateOne(
        { uniqueId: uniqueId, "products.productId": proId },
        {
          $set: {
            "products.$.status": "cancelled",
          },
        }
      );

      await Product.findOneAndUpdate(
        { _id: proId },
        { $inc: { quantity: count } }
      );
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500")
  }
};

//--------------------- REQUESTING FOR RETURN ORDER --------------

const returnRequest = async (req, res) => {
  try {
    const proId = req.query.id;
    const uniqueId = req.query.uniqueId;
    await Order.updateOne(
      { uniqueId: uniqueId, "products.productId": proId },
      {
        $set: {
          "products.$.status": "request",
        },
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error)
    res.status(500).render("500")
  }
};

//------------------------ RETURN ORDER --------------------------

const returnOrder = async (req, res) => {
  try {
    const proId = req.query.id;
    const count = req.query.count;
    const uniqueId = req.query.uniqueId;

    await Order.updateOne(
      { uniqueId: uniqueId, "products.productId": proId },
      {
        $set: {
          "products.$.status": "Accepted",
        },
      }
    );

    await Product.findOneAndUpdate(
      { _id: proId },
      { $inc: { quantity: count } }
    );

    res.json({ success: true });
  } catch (error) {
    console.log(error)
    res.status(500).render("500")
  }
};

//---------------------- INVOICE PAGE -------------------

const invoicePageLoad = async (req, res) => {
  try {
    const orderId = req.query.id;
    const orderData = await Order.findOne({ uniqueId: orderId });
    const deliverdData = orderData.products.filter(
      (product) => product.status == "Delivered"
    );
    const userId = orderData.userId;
    const addressId = orderData.deliveryDetails.trim();
    const addressData = await Address.findOne(
      { user: userId },
      { address: { $elemMatch: { _id: addressId } } }
    );
    const deliveryData = addressData.address[0];
    let subTotal = 0;
    deliverdData.forEach((product) => {
      subTotal = subTotal + product.totalPrice;
    });
    res.render("invoice", { deliverdData, orderData, deliveryData, subTotal });
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
};

//---------------- INVOICE CANCEL BUTTON -------------

const invoiceCancel = async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
};

module.exports = {
  orderPlace,
  successPage,
  ordermanagementpage,
  orderDetailsPage,
  orderDetailsPageUserside,
  statusChanging,
  cancellOrder,
  returnRequest,
  returnOrder,
  invoicePageLoad,
  invoiceCancel,
  verifyPayment,
};
