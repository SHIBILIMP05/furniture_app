const User = require("../model/userModel")
const Category = require("../model/categoryModel")
const Products = require("../model/productsModel")
const Cart = require("../model/cartModel")
const sharp = require("sharp");
const fs = require("fs")
const path = require("path")

//--------------LOAD PRODUCT MANAGEMENT IN ADMIN SIDE------------------

const product = async (req, res) => {
    try {

        const productData = await Products.find({})
        res.render("productmanagement", { productData })

    } catch (error) {
        console.log(error)
        res.status(500).render("500")
    }
}

//--------------------LOAD ADD PRODUCT PAGE---------------------

const loadaddproduct = async (req, res) => {
    try {
        const nameAlready = req.session.proNameAlready
        const categoryData = await Category.find({ blocked: 0 })
        res.render("addproduct", { categoryData, nameAlready })
    } catch (error) {
        console.log(error)
        res.status(500).render("500")
    }
}

//-----------------------ADD PRODUCT WITH FULL DETAILS-------------

const addproduct = async (req, res) => {
    try {
       const already = await Products.findOne({ name: req.body.name });
       if (already) {
          req.session.proNameAlready = true;
          return res.redirect("/admin/loadaddproduct");
       }
 
       const details = req.body;
       const files = req.files;
 
       // Process each uploaded image
       const img = files.map((file) => file.filename);
 
       for (let i = 0; i < img.length; i++) {
          await sharp("public/products/images/" + img[i])
             .resize(500, 500)
             .toFile("public/products/crops/" + img[i]);
       }
 
       let product = new Products({
        name: details.name,
        price: details.price,
        quantity: details.quantity,
        category: details.category,
        description: details.description,
        blocked: 0,
        offer: {
            discount: details.discount || 0,
            activationDate: details.activationDate || null,
            expiryDate: details.expiryDate || null,
        },
    });
 
       // Set images in the product document
       img.forEach((filename, index) => {
          product.images["image" + (index + 1)] = filename;
       });
 
       const result = await product.save();
       res.redirect("/admin/productmanagement");
    } catch (error) {
        console.log(error)
        res.status(500).render("500")
    }
 };
 



//---------------------BLOCK AND UNBLOCK PRODUCTS IN ADMIN SIDE---------------

const blockProduct = async (req, res) => {
    try {
        const blockedproduct = await Products.findOne({ _id: req.body.proId })
        if (blockedproduct.blocked == 0) {
            await Products.updateOne({ _id: req.body.proId }, { $set: { blocked: 1 } })
            res.json({success:true})
        } else {
            await Products.updateOne({ _id: req.body.proId }, { $set: { blocked: 0 } })
            res.json({success:true})
        }


    } catch (error) {
        console.log(error)
        res.status(500).render("500")
    }
}

//--------------------LOAD EDITE PRODUCT PAGE-------------------

const loadeditProduct = async (req, res) => {
    try {

        const categoryData = await Category.find({ blocked: 0 })
        const editProduct = await Products.findOne({ _id: req.query.id })
        res.render("editproductpage", { product: editProduct, categoryData })

    } catch (error) {
        console.log(error)
        res.status(500).render("500")
    }
}

//----------------------UPDATING PRODUCTS ----------------------------------------


const editedProduct = async (req, res) => {
    try {

        let details = req.body;
        let imagesFiles =  req.files;
        
        let currentData = await Products.findOne({ _id: req.query.id });


        const oldImg = [
            imagesFiles.image1 ?  currentData.images.image1 :null,
            imagesFiles.image2 ?  currentData.images.image2 :null,
            imagesFiles.image3 ?  currentData.images.image3 :null,
            imagesFiles.image4 ?  currentData.images.image4 :null,
        ];

        

        const img = [
            imagesFiles.image1 ? imagesFiles.image1[0].filename : currentData.images.image1,
            imagesFiles.image2 ? imagesFiles.image2[0].filename : currentData.images.image2,
            imagesFiles.image3 ? imagesFiles.image3[0].filename : currentData.images.image3,
            imagesFiles.image4 ? imagesFiles.image4[0].filename : currentData.images.image4,
        ];

        
        for (let k = 0; k < oldImg.length; k++) {
            if (oldImg[k] && !img.includes(oldImg[k])) {
                let imagePath = path.resolve('public/products/images', oldImg[k]);
                let cropPath = path.resolve('public/products/crops', oldImg[k]);
                

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                if (fs.existsSync(cropPath)) {
                    fs.unlinkSync(cropPath);
                   
                }
            }
        }
       


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
        console.log(error)
        res.status(500).render("500")
    }
}



//----------------------DELETING PRODUCT FROM PRODUCT MANAGEMENT-------------------

const deleteProduct = async (req, res) => {
    try {

        await Products.deleteOne({ _id: req.query.id })
        res.redirect("/admin/productmanagement")

    } catch (error) {
        console.log(error)
        res.status(500).render("500")
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
        const cart = await Cart.findOne({userId:req.session.user_id})
        let cartCount=0; 
        if(cart){cartCount = cart.products.length}
        const user = await User.findOne({ _id: req.session.user_id });

        let wishCount = 0;
        if (user && user.wishlist) {
            const wishlist = user.wishlist.items;
            wishCount = wishlist ? wishlist.length : 0;
        }

        const products = await Products.find({ blocked: 0 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const count = await Products.find({ blocked: 0 }).count()
        const totalPages = Math.ceil(count / limit);
        res.render("productspage", { cartCount,wishCount,totalPages: totalPages, category: category, products: products, count: count, name: req.session.name })
    } catch (error) {
        console.log(error)
        res.status(500).render("500")
    }
}

//---------------------PRODUCT DETAILS PAGE---------------

const productdetailspage = async (req, res) => {
    try {

        const viewProduct = await Products.findOne({ _id: req.query.id })
        const products = await Products.find({ blocked: 0 })
        const cart = await Cart.findOne({userId:req.session.user_id})
        let cartCount=0; 
        if(cart){cartCount = cart.products.length}
        const user = await User.findOne({ _id: req.session.user_id });

        let wishCount = 0;
        if (user && user.wishlist) {
            const wishlist = user.wishlist.items;
            wishCount = wishlist ? wishlist.length : 0;
        }

        //---------------OFFER CALCULATION----------------

        const originalprice = viewProduct.price;
        
        const categoryData = await Category.findOne({ name: viewProduct.category });

        const discount =viewProduct.offer.discount >= categoryData.offer.discount?viewProduct.offer.discount:categoryData.offer.discount
            

        const offer =viewProduct.offer.discount >= categoryData.offer.discount?"productoffer":"categoryoffer"
            

        let discountprice = 0;

        if (offer === "productoffer" &&viewProduct.offer &&viewProduct.offer.discount > 0 &&viewProduct.offer.activationDate <= new Date() &&viewProduct.offer.expiryDate >= new Date()) {
            
            discountprice = originalprice - (originalprice * discount) / 100;

        } else if (offer === "categoryoffer" &&categoryData.offer &&categoryData.offer.discount > 0 &&categoryData.offer.activationDate <= new Date() &&categoryData.offer.expiryDate >= new Date()) {
            
            discountprice = originalprice - (originalprice * discount) / 100;
        }

        let price = 0;

        if (discountprice === 0 ) {
            
            price = 0;
        } else {
            price = Math.floor(discountprice);
        }

      

        if (price !== 0&&viewProduct.price !== price){
            await Products.updateOne({ _id: req.query.id }, { $set: { price: price } });
        }

            //----------------------------------------------
            const currentproductdata = await Products.findOne({ _id: req.query.id })
            
        if (viewProduct) {
            res.render("productdetailspage", { cartCount,wishCount,products, view: currentproductdata, name: req.session.name, price: price,originalprice })
        } else {
            res.status(404).render("404");
        }

    } catch (error) {
        console.log(error)
        res.status(500).render("500")
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

