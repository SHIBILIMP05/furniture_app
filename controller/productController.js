const User = require("../model/userModel")
const Admin = require("../model/adminModel")
const Category = require("../model/categoryModel")
const Products = require("../model/productsModel")
const fs = require("fs");
const multer = require("../middleware/multer");
const path = require("path");
const sharp = require("sharp");


//--------------LOAD PRODUCT MANAGEMENT IN ADMIN SIDE------------------

const product = async (req, res) => {
    try {

        const productData = await Products.find({})
        res.render("productmanagement", { productData })

    } catch (error) {
        console.error(error.message)
    }
}

//--------------------LOAD ADD PRODUCT PAGE---------------------

const loadaddproduct = async (req, res) => {
    try {
        const nameAlready = req.session.proNameAlready
        const categoryData = await Category.find({ blocked: 0 })
        res.render("addproduct", { categoryData, nameAlready })
    } catch (error) {
        console.error(error.message)
    }
}

//-----------------------ADD PRODUCT WITH FULL DETAILS-------------

const addproduct = async (req, res) => {
    try {

        const already = await Products.findOne({ name: req.body.name })
        if (already) {
            req.session.proNameAlready = true
            res.redirect("/admin/loadaddproduct")
        } else {
            const details = req.body
            const files = req.files

            const img = [
                files.image1[0].filename,
                files.image2[0].filename,
                files.image3[0].filename,
                files.image4[0].filename,
            ]
            for (let i = 0; i < img.length; i++) {
                await sharp("public/products/images/" + img[i])
                    .resize(500, 500)
                    .toFile("public/products/crops/" + img[i])
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

        }

    } catch (error) {
        console.error(error.message)
    }
}

//---------------------BLOCK AND UNBLOCK PRODUCTS IN ADMIN SIDE---------------

const blockProduct = async (req, res) => {
    try {

        const blockedproduct = await Products.findOne({ _id: req.query.id })
        if (blockedproduct.blocked == 0) {
            await Products.updateOne({ _id: req.query.id }, { $set: { blocked: 1 } })
            res.redirect("/admin/productmanagement")
        } else {
            await Products.updateOne({ _id: req.query.id }, { $set: { blocked: 0 } })
            res.redirect("/admin/productmanagement")
        }


    } catch (error) {
        console.error(error.message)
    }
}

//--------------------LOAD EDITE PRODUCT PAGE-------------------

const loadeditProduct = async (req, res) => {
    try {

        const categoryData = await Category.find({ blocked: 0 })
        const editProduct = await Products.findOne({ _id: req.query.id })
        res.render("editproductpage", { product: editProduct, categoryData })

    } catch (error) {
        console.error(error.message)
    }
}

//----------------------UPDATING PRODUCTS ----------------------------------------

const editedProduct = async (req, res) => {
    try {

        let details = req.body;
        let imagesFiles = await req.files;
        let currentData = await Products.findOne({ _id: req.query.id });

        const img = [
            imagesFiles.image1 ? imagesFiles.image1[0].filename : currentData.images.image1,
            imagesFiles.image2 ? imagesFiles.image2[0].filename : currentData.images.image2,
            imagesFiles.image3 ? imagesFiles.image3[0].filename : currentData.images.image3,
            imagesFiles.image4 ? imagesFiles.image4[0].filename : currentData.images.image4,
        ];

        for (let i = 0; i < img.length; i++) {
            await sharp("public/products/images/" + img[i])
                .resize(500, 500)
                .toFile("public/products/crops/" + img[i]);
        }

        let img1, img2, img3, img4;

        img1 = imagesFiles.image1 ? imagesFiles.image1[0].filename : currentData.images.image1;
        img2 = imagesFiles.image2 ? imagesFiles.image2[0].filename : currentData.images.image2;
        img3 = imagesFiles.image3 ? imagesFiles.image3[0].filename : currentData.images.image3;
        img4 = imagesFiles.image4 ? imagesFiles.image4[0].filename : currentData.images.image4;

        let update = await Products.updateOne(
            { _id: req.query.id },
            {
                $set: {
                    name: details.name,
                    price: details.price,
                    quantity: details.quantity,
                    category: details.category,
                    description: details.description,
                    "images.image1": img1,
                    "images.image2": img2,
                    "images.image3": img3,
                    "images.image4": img4,
                },
            }
        );
        res.redirect("/admin/productmanagement");

    } catch (error) {
        console.error(error.message)
    }
}

//----------------------DELETING PRODUCT FROM PRODUCT MANAGEMENT-------------------

const deleteProduct = async (req, res) => {
    try {

        await Products.deleteOne({ _id: req.query.id })
        res.redirect("/admin/productmanagement")

    } catch (error) {
        console.error(error.message)
    }
}

//-------------------------PRODUCTS PAGE IN USER SIDE---------------------------

const loadproductsPage = async (req, res) => {
    try {
        const category = await Category.find({ blocked: 0 })
        var page = 1;
        var limit = 8;
        if (req.query.page) {
            page = req.query.page;
        }
        const products = await Products.find({ blocked: 0 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const count = await Products.find({ blocked: 0 }).count()
        const totalPages = Math.ceil(count / limit);
        res.render("productspage", { totalPages: totalPages, category: category, products: products, count: count, name: req.session.name })
    } catch (error) {
        console.error(error.message)
    }
}

//---------------------PRODUCT DETAILS PAGE---------------

const productdetailspage = async (req, res) => {
    try {

        const viewProduct = await Products.findOne({ _id: req.query.id })
        const products = await Products.find({ blocked: 0 })
        const category = await Category.find({ blocked: 0 })
        if (viewProduct) {


            res.render("productdetailspage", { products, category, view: viewProduct, name: req.session.name })
        } else {
            res.status(404).render("404");
        }



    } catch (error) {
        console.error(error.message)
    }
}


module.exports = {
    product,
    loadaddproduct,
    addproduct,
    blockProduct,
    deleteProduct,
    loadeditProduct,
    editedProduct,
    loadproductsPage,
    productdetailspage,
}

