const mongoose = require("mongoose");

const offerSchema = mongoose.Schema({

    productOffer:[{
        name:{
            type:String,
            required:true
        },
        discount:{
            type:Number,
            required:true
        },
        activationDate:{
            type:Date,
        },
        expiryDate:{
            type:Date,
        }
    }],
    categoryOffer:[{
        name:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        discount:{
            type:Number,
            required:true
        },
        activationDate:{
            type:Date,
            required:true
        },
        expireDate:{
            type:Date,
            required:true
        }
    }],
    referalOffer:[{
        name:{
            type:String,
            required:true
        },
        discount:{
            type:Number,
            required:true
        },
        activationDate:{
            type:Date,
            required:true
        },
        expireDate:{
            type:Date,
            required:true
        },
        referalCode:{
            type:String,
        }
    }]
    
})
 module.exports = mongoose.model("Offer",offerSchema)