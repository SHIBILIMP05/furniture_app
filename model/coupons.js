const mongoose = require("mongoose");

const coupons = mongoose.Schema({

    couponName :{
        type:String,
        required:true
    },
    couponCode:{
        type:String,
        required:true
    },
    descountAmount:{
        type:Number,
        required:true
    },endDate:{
        type:Date,
        required:true
    }

});

module.exports = mongoose.module("Coupons",coupons);