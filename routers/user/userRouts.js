const express = require("express")
const user_Rout = express()
const session = require("express-session")

const config = require('../../config/config')
const userController = require("../../controller/user/userController")
const auth = require("../../middleware/auth")

user_Rout.use(session({secret:config.sessionSecret}))

//--------------view engine------------------
user_Rout.set("view engine","ejs")
user_Rout.set("views","./views/user")

//--------------body parser------------------
const bodyParser = require("body-parser")
user_Rout.use(bodyParser.json())
user_Rout.use(bodyParser.urlencoded({extended:true}))



//!-------------router handle----------------
user_Rout.get("/",auth.isLogout,userController.loadHome)
user_Rout.get("/home",auth.isLogin,userController.loadHome)
user_Rout.get("/login",auth.isLogout,userController.loadLogin)
user_Rout.get("/signup",auth.isLogout,userController.loadSignup)
user_Rout.get("/verify",userController.verifyMail)

user_Rout.post("/register",userController.insertuser)
user_Rout.post("/login",userController.verifylogin)


module.exports = user_Rout;