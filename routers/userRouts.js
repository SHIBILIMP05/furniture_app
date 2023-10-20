const express = require("express")
const user_Rout = express()

//--------------view engine------------------
user_Rout.set("view engine","ejs")
user_Rout.set("views","./views/user")

//--------------body parser------------------
const bodyParser = require("body-parser")
user_Rout.use(bodyParser.json())
user_Rout.use(bodyParser.urlencoded({extended:true}))

const userController = require("../controller/userControoller")

//!-------------router handle-----------------
user_Rout.get("/",userController.loadLogin)
user_Rout.get("/signup",userController.loadSignup)
user_Rout.post("/register",userController.insertuser)

module.exports = user_Rout;