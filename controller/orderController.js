const User = require("../model/userModel");
const Cart = require("../model/cartModel");
const Address = require("../model/addressModel");
const Product = require("../model/productsModel");
const Order = require("../model/ordersModel");
const Coupon = require("../model/couponsModel");
const mongoose = require("mongoose")
const { render } = require("../routers/user/userRouts");
const res = require("express/lib/response");

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
      console.log("2");
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

//-----------------------ORDER MANAGEMENT PAGE IN ADMIN SIDE-----------

const ordermanagementpage = async(req,res)=>{
  try {
    const orderData = await Order.find().sort({date:-1})
    res.render("ordermanagement",{orderData})
  } catch (error) {
    console.error(error.message);
  }
}

//------------------ORDER DETALS PAGE  IN ADMIN SIDE-------------

const orderDetailsPage = async(req,res)=>{
  try {

    const uniqueId = req.query.id
    const orderData = await Order.findOne({uniqueId:uniqueId})
    const userId =  orderData.userId
    const addressId = orderData.deliveryDetails.trim()
    console.log('Address ID:', addressId);
    const addressData = await Address.findOne(
      { user: userId },
      { address: { $elemMatch: { _id: addressId } } }
    );
    const deliveryData = addressData.address[0]; // Get the first element of the array
    
    res.render("orderdetailspage",{orderData,deliveryData})
  } catch (error) {
    console.error(error.message);
  }
}

//-----------------------ORDER DETAILSE PAGE IN USER SIDE----------------

const orderDetailsPageUserside = async(req,res)=>{
  try {
    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }
    const uniqueId = req.query.id
    const orderData = await Order.findOne({uniqueId:uniqueId})
    const userId =  orderData.userId
    const addressId = orderData.deliveryDetails.trim()
    
    const addressData = await Address.findOne(
      { user: userId },
      { address: { $elemMatch: { _id: addressId } } }
    );
    const deliveryData = addressData.address[0]

    res.render("orderdetailsUserside",{cartCount,deliveryData,orderData})
  } catch (error) {
    console.error(error.message);
  }
}

//---------------------------ORDER STATUS CHANGING-------------------------

const statusChanging = async(req,res)=>{
  try {
    const uniqueId = req.body.uniqueId
    const statusVal = req.body.num
    const proId = req.body.id
    console.log(uniqueId)
    console.log(statusVal)
    console.log(proId);
    let result
    if(statusVal==1){

      result = await Order.updateOne(
        {uniqueId:uniqueId,
        'products.productId':proId},
        {
          $set: {
            'products.$.status': 'Shipped', 
          }
        }
      );

    }else if(statusVal==2){
      result = await Order.updateOne(
        {uniqueId:uniqueId,
        'products.productId':proId},
        {
          $set: {
            'products.$.status': 'Placed', 
          }
        }
      );
    }else if(statusVal == 3){
      result = await Order.updateOne(
        {uniqueId:uniqueId,
        'products.productId':proId},
        {
          $set: {
            'products.$.status': 'Out for delivery', 
          }
        }
      );
    }else if(statusVal == 4){
       result = await Order.updateOne(
        {uniqueId:uniqueId,
        'products.productId':proId},
        {
          $set: {
            'products.$.status': 'Delivered', 
          }
        }
      );
    }
    if (result) {
      // Successfully updated
      res.json({success:true})
    } else {
      // No matching document found
      console.log("not updated");
      return res.status(404);
      
    }

    
  


  } catch (error) {
    console.error(error.message);
  }
}

//--------------------------- CANCELL ORDER ---------------------

const cancellOrder = async(req,res)=>{
  try {
    
    const proId = req.query.id
    const count = req.query.count
    const uniqueId = req.query.uniqueId

    await Order.updateOne(
      {uniqueId:uniqueId,
      'products.productId':proId},
      {
        $set: {
          'products.$.status': 'cancelled', 
        }
      }
    );
    
      await Product.findOneAndUpdate(
        { _id: proId },
        { $inc: { quantity: count } }
      );
    res.json({success:true})

  } catch (error) {
    console.error(error.message);
  }
}

//--------------------- REQUESTING FOR RETURN ORDER --------------

const returnRequest = async(req,res)=>{
  try {

    const proId = req.query.id
    const uniqueId = req.query.uniqueId
    await Order.updateOne(
      {uniqueId:uniqueId,
      'products.productId':proId},
      {
        $set: {
          'products.$.status': 'request', 
        }
      }
    );
    res.json({success:true})

    
  } catch (error) {
    console.error(error.message);
  }
}

//------------------------ RETURN ORDER --------------------------

const returnOrder = async(req,res)=>{
  try {
    const proId = req.query.id
    const count = req.query.count
    const uniqueId = req.query.uniqueId

    await Order.updateOne(
      {uniqueId:uniqueId,
      'products.productId':proId},
      {
        $set: {
          'products.$.status': 'Accepted', 
        }
      }
    );
    
      await Product.findOneAndUpdate(
        { _id: proId },
        { $inc: { quantity: count } }
      );

    res.json({success:true})
    
  } catch (error) {
    console.error(error.message);
  }
}

module.exports={
    orderPlace,
    successPage,
    ordermanagementpage,
    orderDetailsPage,
    orderDetailsPageUserside,
    statusChanging,
    cancellOrder,
    returnRequest,
    returnOrder
}