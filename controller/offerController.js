const Offer = require("../model/offerModel")

//======================== LOAD PRODUCT OFFER PAGE ====================
const loadProductOffer = async (req, res) => {

    try {
        const offer = await Offer.find({ productOffer: { $ne: [] } })
        console.log(offer);
        res.render("productOffer", { offer })
    } catch (error) {
        console.log(error)
    }
}

//======================== LOAD ADD PRODUCT OFFER PAGE ====================

const loadAddProductOffer = async (req, res) => {

    try {
        res.render("addProductOffer")
    } catch (error) {
        console.log(error)
    }
}

//======================== ADD PRODUCT OFFER ====================

const addProductOffer = async (req, res) => {

    try {
        console.log("heii");
        const productData = {
            name: req.body.name,
            discount: req.body.discount,
            activationDate: req.body.activationDate,
            expiryDate: req.body.expiryDate
        };

        const offerDdata = await Offer.find()
        const offerId = offerDdata[0]._id 

        await Offer.updateOne(
            { _id: offerId },
            { $push: { productOffer: productData } }
        );
        
        res.json({success:true})
    } catch (error) {
        console.log(error)
    }
}

//======================== LOAD CATEGORY OFFER PAGE ===================

const loadCategoryOffer = async (req, res) => {

    try {
        const offer = await Offer.find({ categoryOffer: { $ne: [] } })
        console.log(offer);
        res.render("categoryOffer", { offer })
    } catch (error) {
        console.log(error)
    }
}

//====================== LOAD USER REFERRAL PAGE =======================

const loadReferalOffer = async (req, res) => {
    try {
        const offer = await Offer.find({ referalOffer: { $ne: [] } })
        console.log(offer);
        res.render("referalOffer", { offer })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { loadProductOffer, loadCategoryOffer, loadReferalOffer , addProductOffer , loadAddProductOffer}