const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    blocked:{
        type:Number,
        default:0
    },
    offer: {
        discount: {
            type: Number,
            default: 0,
        },
        activationDate: {
            type: Date,
            default:null
        },
        expiryDate: {
            type: Date,
            default:null
        },
    },

});

 module.exports = mongoose.model("Category",categorySchema)