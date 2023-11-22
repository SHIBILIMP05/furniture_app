const express = require("express")
const user_Rout = express()
const session = require("express-session")

const config = require('../../config/config')
const userController = require("../../controller/userController")
const productController =require("../../controller/productController")
const auth = require("../../middleware/auth")

user_Rout.use(session({secret:config.sessionSecret}))

//--------------view engine------------------
user_Rout.set("view engine","ejs")
user_Rout.set("views","./views/user")

//--------------body parser------------------
const bodyParser = require("body-parser")
user_Rout.use(bodyParser.json())
user_Rout.use(bodyParser.urlencoded({extended:true}))




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

user_Rout.get("/forgetpage",auth.isLogout,userController.loadForget)
user_Rout.post("/forget",userController.forgetverify)
user_Rout.get("/forget-password",auth.isLogout,userController.forgetpasswordload)
user_Rout.post("/forget-password",userController.resetpassword)

user_Rout.get("/loadproduct",productController.loadproductsPage)
user_Rout.get("/productdetails",productController.productdetailspage)
user_Rout.get("/searchPro",userController.searchProduct)
user_Rout.post("/filterProduct",userController.filterProducts)



module.exports = user_Rout;