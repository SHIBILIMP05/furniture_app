const express = require("express")
const admin_Rout = express()
const path =require("path")
const multer = require("../../middleware/multer")
const multer2 = require("../../middleware/multer2")

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

const productController =require("../../controller/productController")
const adminController = require("../../controller/adminController")
const auth = require("../../middleware/adminAuth")

admin_Rout.get("/",auth.isLogout,adminController.adminLoginPage)
admin_Rout.post("/",adminController.adminLogin)
admin_Rout.get("/home",auth.isLogin,adminController.loadDashboard)
admin_Rout.get("/logout",auth.isLogin,adminController.logout)
admin_Rout.get("/usermanagement",auth.isLogin,adminController.usermanagementload)
admin_Rout.post("/block-user",auth.isLogin,adminController.blockUser)

admin_Rout.get("/productmanagement",auth.isLogin,productController.product)
admin_Rout.get("/loadaddproduct",auth.isLogin,productController.loadaddproduct)
admin_Rout.post("/addproduct",auth.isLogin,multer.productImagesUpload,productController.addproduct)
admin_Rout.get("/block-product",auth.isLogin,productController.blockProduct)
admin_Rout.get("/delete-product",auth.isLogin,productController.deleteProduct)
admin_Rout.get("/edit-product-page",auth.isLogin,productController.loadeditProduct)
admin_Rout.post("/editProduct", auth.isLogin, multer2.productImagesUpload2, productController.editedProduct);

admin_Rout.get("/categorymanagement",auth.isLogin,adminController.loadcategory)
admin_Rout.get("/loadaddcategory",auth.isLogin,adminController.loadAddCategory)
admin_Rout.post("/addcategory",auth.isLogin,adminController.addCategory)
admin_Rout.post("/block-category",auth.isLogin,adminController.blockCategory)
admin_Rout.get("/edit-category",auth.isLogin,adminController.loadeditCategory)
admin_Rout.post("/editCategory",auth.isLogin,adminController.updateCategory)
admin_Rout.get("/delete-category",auth.isLogin,adminController.deleteCategory)


admin_Rout.get("*",function(req,res){
    res.redirect("/admin")
})



module.exports = admin_Rout