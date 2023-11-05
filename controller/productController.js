const User = require("../model/userModel")
const Admin = require("../model/adminModel")
const Category = require("../model/categoryModel")
const Products = require("../model/productsModel")
const Sharp = require("sharp");
const fs = require("fs");
const multer = require("../middleware/multer");
const path  = require("path");
const sharp = require("sharp");


//--------------LOAD PRODUCT MANAGEMENT IN ADMIN SIDE------------------

const product = async(req,res)=>{
    try {
        
        const productData = await Products.find({})
        res.render("productmanagement",{productData})
   
    } catch (error) {
        console.error(error.message)
    }
}

//--------------------LOAD ADD PRODUCT PAGE---------------------

const loadaddproduct = async(req,res)=>{
    try {
        const categoryData = await Category.find({blocked:0})
        res.render("addproduct",{categoryData})
    } catch (error) {
        console.error(error.message)
    }
}

//-----------------------ADD PRODUCT WITH FULL DETAILS-------------

const addproduct = async(req,res)=>{
    try {
        
        const details = req.body
        const files = req.files

        const img = [
            files.image1[0].filename,
            files.image2[0].filename,
            files.image3[0].filename,
            files.image4[0].filename,
        ]

        for(let i=0;i<img.length;i++){
            await sharp("public/products/images/"+img[i])
            .resize(500,500)
            .toFile("public/products/crops/"+img[i])
        }

        let product = new Products({
            name: details.name,
            price: details.price,
            quantity: details.quantity,
            category: details.category,
            description: details.description,
            blocked: 0,
            "images.image1": files.image1[0].filename,
            "images.image2": files.image2[0].filename,
            "images.image3": files.image3[0].filename,
            "images.image4": files.image4[0].filename,
        })

        const result = await product.save()
        res.redirect("/admin/productmanagement")

    } catch (error) {
        console.error(error.message)
    }
}

//---------------------BLOCK AND UNBLOCK PRODUCTS IN ADMIN SIDE---------------

const blockProduct = async(req,res)=>{
    try {
        
        const blockedproduct = await Products.findOne({_id:req.query.id})
        if(blockedproduct.blocked == 0){
            await Products.updateOne({_id:req.query.id},{$set:{blocked:1}})
            res.redirect("/admin/productmanagement")
        }else{
            await Products.updateOne({_id:req.query.id},{$set:{blocked:0}})
            res.redirect("/admin/productmanagement")
        }


    } catch (error) {
        console.error(error.message)
    }
}

//--------------------LOAD EDITE PRODUCT PAGE-------------------

const loadeditProduct = async(req,res)=>{
    try {
        
        const categoryData = await Category.find({blocked:0})
        const editProduct = await Products.find({_id:req.query.id})
        res.render("editproductpage",{productData:editProduct,categoryData}) 

    } catch (error) {
        console.error(error.message)
    }
}

//----------------------DELETING PRODUCT FROM PRODUCT MANAGEMENT-------------------

const deleteProduct = async(req,res)=>{
    try {
        
        await Products.deleteOne({_id:req.query.id})
        res.redirect("/admin/productmanagement")

    } catch (error) {
        console.error(error.message)
    }
}



module.exports={
    product,
    loadaddproduct,
    addproduct,
    blockProduct,
    deleteProduct,
}

