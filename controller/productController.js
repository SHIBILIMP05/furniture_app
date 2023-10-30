const User = require("../model/userModel")
const Admin = require("../model/adminModel")
const Product = require("../model/productsModel")
const Sharp = require("sharp");
const fs = require("fs");
const multer = require("../middleware/multer");
const path  = require("path");
const sharp = require("sharp");


//--------------LOAD PRODUCT MANAGEMENT IN ADMIN SIDE------------------

const product = async(req,res)=>{
    try {
        console.log("1")
        const productData = Product.find({})
        res.render("productmanagement",{products:productData})
        console.log("2")
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
            await sharp("/public/user/images/products"+img[i])
            .resize(500,500)
            .toFile("public/user/images/crop"+img[i])
        }

        let product = new Product({
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



module.exports={
    product,
    loadaddproduct,
    addproduct,
}

