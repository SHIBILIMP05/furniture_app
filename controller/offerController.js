const User = require("../model/userModel")
const Product = require("../model/productsModel")
const Category = require("../model/categoryModel")
const Referal = require("../model/referalModel")

//------------- LOAD EDIT PRODUCT OFFER PAGE ----------------

const loadEditProductOffer = async(req,res)=>{
    try {
        const proId = req.query.id
        const productData = await Product.findById({_id:proId})
        res.render("editProductOffer",{productData})
    } catch (error) {
        console.log(error)
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
    }
}

//--------------- LOAD REFERAL MANAGEMENT PAGE ----------------

const loadReferalManagement = async(req,res)=>{
    try {
        const Referaldata = await Referal.find()
        res.render("referalOffer",{Referaldata})
    } catch (error) {
        console.log(error)
    }
}

//--------------- LOAD ADD REFERAL OFFER  -----------------------

const loadAddReferalOffer = async(req,res)=>{
    try {
        res.render("addReferalOffer")
    } catch (error) {
        console.log(error)
    }
}

//--------------- LOAD EDIT REFERAL OFFER  -----------------------

const loadEditReferalOffer = async(req,res)=>{
    try {
        const referalId = req.query.id
        const referalData = await Referal.findById({_id:referalId})
        res.render("editReferalOffer",{referalData})
    } catch (error) {
        console.log(error)
    }
}

//-------------------------- ADD REFERAL OFFER  -----------------------

const addReferalOffer = async(req,res)=>{
    try {
        const referalData = await Referal.findOne({referalCode:req.body.referal})

       console.log(referalData)

        if(referalData){
            res.json({exist:true})
        }else{
            const newReferal = new Referal({
                referalCode:req.body.referal,
                amount:req.body.discount,
                Date:new Date(),
            })
            await newReferal.save()
            res.json({success:true})
        }
    } catch (error) {
        console.log(error);
    }
}

//-------------------------- EDIT REFERAL OFFER  -----------------------

const editReferalOffer = async(req,res)=>{
    try {
        const referalId = req.body.id
        const discount = req.body.discount
        const referal = req.body.referal

        const updatedReferal = await Referal.findOneAndUpdate({_id:referalId},{
            $set:{
                amount:discount,
                referalCode:referal
            }
        })
        if(updatedReferal){
            res.json({success:true})
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports={
    loadEditProductOffer,
    editProductOffer,
    loadEditCategoryOffer,
    editCategoryOffer,
    loadReferalManagement,
    loadAddReferalOffer,
    loadEditReferalOffer,
    addReferalOffer,
    editReferalOffer


}