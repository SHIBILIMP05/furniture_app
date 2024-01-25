const Product = require("../model/productsModel")
const Category = require("../model/categoryModel")

//------------- LOAD EDIT PRODUCT OFFER PAGE ----------------

const loadEditProductOffer = async(req,res)=>{
    try {
        const proId = req.query.id
        const productData = await Product.findById({_id:proId})
        res.render("editProductOffer",{productData})
    } catch (error) {
        console.log(error)
        res.status(500).render("500")
    }
}

//-------------- EDIT PRODUCT OFFER -----------------------------

const editProductOffer = async(req,res)=>{
    try {
        const proId = req.body.proId

        const { discount, activationDate, expiryDate } = req.body;

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: proId },
            {
                $set: {
                    "offer.discount": discount,
                    "offer.activationDate": activationDate,
                    "offer.expiryDate": expiryDate,
                },
            },
            { new: true } 
        );

        if(updatedProduct){
            res.json({success:true})
        }else{
            console.log("Offer Not Added")
        }
    } catch (error) {
        console.log(error);
        res.status(500).render("500")
    }
}

//------------- LOAD EDIT CTEGORY OFFER PAGE ----------------

const loadEditCategoryOffer = async(req,res)=>{
    try {
        const id = req.query.id
        const categoryData = await Category.findById({_id:id})
        res.render("editCategoryOffer",{categoryData})
    } catch (error) {
        console.log(error)
        res.status(500).render("500")
    }
}

//-------------- EDIT CATEGORY OFFER -----------------------------

const editCategoryOffer = async(req,res)=>{
    try {
        const Id = req.body.Id

        const { discount, activationDate, expiryDate } = req.body;

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: Id },
            {
                $set: {
                    "offer.discount": discount,
                    "offer.activationDate": activationDate,
                    "offer.expiryDate": expiryDate,
                },
            },
            { new: true } 
        );

        if(updatedCategory){
            res.json({success:true})
        }else{
            console.log("Offer Not Added")
        }
    } catch (error) {
        console.log(error);
        res.status(500).render("500")
    }
}



module.exports={
    loadEditProductOffer,
    editProductOffer,
    loadEditCategoryOffer,
    editCategoryOffer,
}