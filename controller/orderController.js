const User = require("../model/userModel");
const Cart = require("../model/cartModel");
const Address = require("../model/addressModel");
const Product = require("../model/productsModel");
const Order = require("../model/ordersModel");
const Coupon = require("../model/couponsModel");
const { render } = require("../routers/user/userRouts");
//---------------------PLACE ORDER WITH COD-----------

const orderPlace = async (req, res) => {
  try {
    console.log("1");

    const id = req.session.user_id;
    const address = req.body.address;
    const cartData = await Cart.findOne({ userId: id });
    const products = cartData.products;
    const total = parseInt(req.body.Total);
    const paymentMethods = req.body.payment;
    const userData = await User.findOne({ _id: id });
    const name = userData.name;
    const uniNum = Math.floor(Math.random() * 900000) + 100000;
    const status = paymentMethods === "COD" ? "placed" : "pending";
    const statusLevel = status === "placed" ? 1 : 0;
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
      status: status,
      statusLevel: statusLevel,
    });
    const orderData = await order.save();
    const orderid = order._id;

    if (orderData) {
      //--------------------CASH ON DELIVERY-------------------//
      console.log("2");
      if (order.status === "placed") {
        console.log("3");
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
          console.log("4");
          const coupon = await Coupon.findOne({ couponCode: req.session.code });
          const disAmount = coupon.discountAmount;
          await Order.updateOne(
            { _id: orderid },
            { $set: { discount: disAmount } }
          );
          res.json({ codsuccess: true, orderid });
        }
        res.json({ codsuccess: true, orderid });
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};


//-----------------ORDER SUCCESS PAGE-------------

const successPage = async(req,res)=>{
    try {
      console.log("5");
      
        const cart = await Cart.findOne({ userId: req.session.user_id });
        let cartCount=0; 
        if (cart) {
          cartCount = cart.products.length;
        }
        res.render("successPage",{name:req.session.name,cartCount})
    } catch (error) {
        console.error(error.message);
    }
}

module.exports={
    orderPlace,
    successPage,
}