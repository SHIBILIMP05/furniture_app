const express = require("express")
const admin_Rout = express()

const session = require("express-session")
const config = require('../../config/config')

admin_Rout.use(session({secret:config.sessionSecret}))


//--------------view engine------------------
admin_Rout.set("view engine","ejs")
admin_Rout.set("views","./views/admin")

//--------------body parser------------------
const bodyParser = require("body-parser")
admin_Rout.use(bodyParser.json())
admin_Rout.use(bodyParser.urlencoded({extended:true}))

const adminController = require("../../controller/admin/adminController")
const auth = require("../../middleware/adminAuth")

admin_Rout.get("/",auth.isLogout,adminController.adminLoginPage)
admin_Rout.post("/",adminController.adminLogin)
admin_Rout.get("/home",auth.isLogin,adminController.loadDashboard)
admin_Rout.get("/logout",auth.isLogin,adminController.logout)

admin_Rout.get("*",function(req,res){
    res.redirect("/admin")
})

module.exports = admin_Rout