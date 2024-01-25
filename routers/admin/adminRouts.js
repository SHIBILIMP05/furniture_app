//============= Required Modules =============

const express = require("express")
const admin_Rout = express()
const path =require("path")
const multer = require("../../middleware/multer")
const multer2 = require("../../middleware/multer2")
const multer3 = require("../../middleware/multer3")






//--------------view engine------------------

admin_Rout.set("views","./views/admin")
//-------------------------------------------



//?================== CONTROLLER HANDLING =================

const productController =require("../../controller/productController")
const adminController = require("../../controller/adminController")
const orderController = require("../../controller/orderController")
const couponController = require("../../controller/couponController")
const bannerConotroller = require("../../controller/bannerController")
const offerController = require("../../controller/offerController")

//------------------- Authentication ------------

const auth = require("../../middleware/adminAuth")

//-----------------------------------------------

//?================== HOME & USER MANAGEMENT HANDLING ==============

admin_Rout.get("/",auth.isLogout,adminController.adminLoginPage)
admin_Rout.post("/",adminController.adminLogin)
admin_Rout.get("/home",auth.isLogin,adminController.loadDashboard)
admin_Rout.get("/logout",auth.isLogin,adminController.logout)
admin_Rout.get("/usermanagement",auth.isLogin,adminController.usermanagementload)
admin_Rout.post("/block-user",auth.isLogin,adminController.blockUser)

//?================== PRODUCT MANAGEMENT HANDLING =================

admin_Rout.get("/productmanagement",auth.isLogin,productController.product)
admin_Rout.get("/loadaddproduct",auth.isLogin,productController.loadaddproduct)
admin_Rout.post("/addproduct",auth.isLogin,multer.productImagesUpload,productController.addproduct)
admin_Rout.post("/block-product",auth.isLogin,productController.blockProduct)
admin_Rout.get("/delete-product",auth.isLogin,productController.deleteProduct)
admin_Rout.get("/edit-product-page",auth.isLogin,productController.loadeditProduct)
admin_Rout.post("/editProduct",auth.isLogin,multer2.productImagesUpload2,productController.editedProduct);

//?================== CATEGORY MANAGEMENT HANDLING =================

admin_Rout.get("/categorymanagement",auth.isLogin,adminController.loadcategory)
admin_Rout.get("/loadaddcategory",auth.isLogin,adminController.loadAddCategory)
admin_Rout.post("/addcategory",auth.isLogin,adminController.addCategory)
admin_Rout.post("/block-category",auth.isLogin,adminController.blockCategory)
admin_Rout.get("/edit-category",auth.isLogin,adminController.loadeditCategory)
admin_Rout.post("/editCategory",auth.isLogin,adminController.updateCategory)
admin_Rout.get("/delete-category",auth.isLogin,adminController.deleteCategory)

//==================== ORDER MANAGEMENT HANDLING ===================

admin_Rout.get("/ordermanagement",auth.isLogin,orderController.ordermanagementpage)
admin_Rout.get("/orderdetailspage",auth.isLogin,orderController.orderDetailsPage)
admin_Rout.post("/statusChange",auth.isLogin,orderController.statusChanging)
admin_Rout.get("/returnOrder",auth.isLogin,orderController.returnOrder)

//===================== COUPON MANAGEMENT HANDLING ===================

admin_Rout.get("/couponManagement",auth.isLogin,couponController.loadCouponManagement)
admin_Rout.get("/loadAddCoupon",auth.isLogin,couponController.loadAddCoupon)
admin_Rout.post("/addCoupon",auth.isLogin,couponController.addCoupon)
admin_Rout.post("/blockCoupon",auth.isLogin,couponController.blockCoupon)
admin_Rout.get("/editCoupon",auth.isLogin,couponController.loadEditeCoupon)
admin_Rout.post("/updateCoupon",auth.isLogin,couponController.EditeCoupon)

//===================== BANNER MANAGEMENT HANDLING ===================

admin_Rout.get("/bannerManagement",auth.isLogin,bannerConotroller.loadBanner)
admin_Rout.get("/loadAddBanner",auth.isLogin,bannerConotroller.loadAddBanner)
admin_Rout.post("/addBanner",auth.isLogin,multer3.bannerUpload,bannerConotroller.addBanner)
admin_Rout.post("/block-banner",auth.isLogin,bannerConotroller.blockBanner)
admin_Rout.post("/delete-banner",auth.isLogin,bannerConotroller.deleteBanner)
admin_Rout.get("/loadeditBanner",auth.isLogin,bannerConotroller.loadEditBanner)
admin_Rout.post("/editBanner",auth.isLogin,multer3.bannerUpload,bannerConotroller.editBanner)

//======================= OFFER MANAGING ==============================

admin_Rout.get("/loadEditProductOffer",auth.isLogin,offerController.loadEditProductOffer)
admin_Rout.post("/editProductOffer",auth.isLogin,offerController.editProductOffer)
admin_Rout.get("/loadEditCategoryOffer",auth.isLogin,offerController.loadEditCategoryOffer)
admin_Rout.post("/editCategoryOffer",auth.isLogin,offerController.editCategoryOffer)


// ======================= SALE MANAGEMENT HANDLING ====================

admin_Rout.get("/loadSalesManagement",auth.isLogin,adminController.loadSalesManagement)
admin_Rout.get("/saleSortPage/:id",auth.isLogin,adminController.saleSortPage)
admin_Rout.get("/reportDown",auth.isLogin,adminController.downloadReport)


admin_Rout.get("*",function(req,res){
   res.redirect("/admin")
})


module.exports = admin_Rout