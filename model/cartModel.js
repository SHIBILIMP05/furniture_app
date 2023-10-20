const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({

    productName:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    }
    

})

module.exports = mongoose.model("Cart",cartSchema);

