const express = require("express")
const user_Rout = express()

//--------------view engine------------------
user_Rout.set("view engine","ejs")
user_Rout.set("views","./views/user")

//--------------body parser------------------
const bodyParser = require("body-parser")
user_Rout.use(bodyParser.json())
user_Rout.use(bodyParser.urlencoded({extended:true}))

const userController = require("../../controller/user/userController")

//!-------------router handle----------------
user_Rout.get("/",userController.loadHome)
user_Rout.get("/login",userController.loadLogin)
user_Rout.get("/signup",userController.loadSignup)
user_Rout.get("/verify",userController.verifyMail)

user_Rout.post("/register",userController.insertuser)
user_Rout.post("/login",userController.verifylogin)


module.exports = user_Rout;