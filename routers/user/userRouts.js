const express = require("express")
const user_Rout = express()

const userController = require("../../controller/userController")
const productController =require("../../controller/productController")
const cartController = require("../../controller/cartController")
const couponController = require("../../controller/couponController")
const addressController = require("../../controller/addressController")
const orderController = require("../../controller/orderController")
const wishlistController = require("../../controller/wishlistController")
const auth = require("../../middleware/auth")



//--------------view engine------------------

user_Rout.set("views","./views/user")

//-------------------------------------------



//?-------------ROUTER HANDLING----------------


user_Rout.get("/",auth.isLogout,userController.loadHome)
user_Rout.get("/home",auth.isLogin,userController.loadHome)

user_Rout.get("/login",auth.isLogout,userController.loadLogin)
user_Rout.post("/login",userController.verifylogin)

user_Rout.get("/signup",auth.isLogout,userController.loadSignup)
user_Rout.post("/register",userController.insertuser)

user_Rout.get("/otp",auth.isLogout,userController.otpload)
user_Rout.post("/verifyOtp",userController.verifyOtp)
user_Rout.get("/resendOtp",userController.resendotp)

user_Rout.get("/logout",auth.isLogin,userController.userLogout)

user_Rout.get("/account",auth.isLogin,userController.accountload)
user_Rout.post("/editProfile",auth.isLogin,userController.editingProfile)
user_Rout.post("/changePassword",auth.isLogin,userController.changePassword)
user_Rout.post("/addBillingAddress",auth.isLogin,addressController.addMultiAaddress)
user_Rout.get("/editAddressPage",auth.isLogin,addressController.addressEditingPage)
user_Rout.post("/editBillingAddress",auth.isLogin,addressController.addressEditing)
user_Rout.post("/removeAddress",auth.isLogin,addressController.removeAddress)
user_Rout.get("/orderDetails",auth.isLogin,orderController.orderDetailsPageUserside)
user_Rout.get("/cancellOrder",auth.isLogin,orderController.cancellOrder)
user_Rout.get("/returnRequest",auth.isLogin,orderController.returnRequest)
user_Rout.get("/loadInvoice",auth.isLogin,orderController.invoicePageLoad)
user_Rout.get("/imvoiceCancel",auth.isLogin,orderController.invoiceCancel)

user_Rout.get("/forgetpage",userController.loadForget)
user_Rout.post("/forget",userController.forgetverify)
user_Rout.get("/forget-password",auth.isLogout,userController.forgetpasswordload)
user_Rout.post("/forget-password",userController.resetpassword)

user_Rout.get("/loadproduct",productController.loadproductsPage)
user_Rout.get("/productdetails",productController.productdetailspage)
user_Rout.get("/searchPro",userController.searchProduct)
user_Rout.post("/filterProduct",userController.filterProducts)

user_Rout.get("/cartLoad",auth.isLogin,cartController.loadCart)
user_Rout.post("/addToCart",cartController.addToCart)
user_Rout.post("/cartQuantityUpdation",auth.isLogin,cartController.quantityUpdation)
user_Rout.post("/removeCartItem",auth.isLogin,cartController.removeCartItem)
user_Rout.get("/checkout",auth.isLogin,userController.loadCheckoutpage)

user_Rout.get("/wishlistLoad",auth.isLogin,wishlistController.loadWishlist)
user_Rout.post("/addToWishList",wishlistController.addToWishlist)
user_Rout.post("/removeWishlistItem",auth.isLogin,wishlistController.removeFromWishlist)

user_Rout.post("/applyCoupon",auth.isLogin,couponController.applyCoupon)
user_Rout.post("/deleteAppliedCoupon",auth.isLogin,couponController.unApplayCoupon)

user_Rout.post("/placeOrder",auth.isLogin,orderController.orderPlace)
user_Rout.get("/orderSuccess/:id",auth.isLogin,orderController.successPage)
user_Rout.post('/verify-payment', auth.isLogin,orderController.verifyPayment)

user_Rout.get("/loadBlog",userController.loadBlog)

user_Rout.get("*", (req, res) => {
    res.render("404")
  })
module.exports = user_Rout;