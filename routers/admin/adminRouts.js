const express = require("express")
const admi_Rout = express()

//--------------view engine------------------
admi_Rout.set("view engine","ejs")
admi_Rout.set("views","./views/admin")


const adminController = require("../../controller/admin/adminController")

admi_Rout.get("/admin",adminController.loadAdmin)

module.exports = admi_Rout