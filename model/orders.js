const mongoose = require("mongoose")

const orders = mongoose.Schema({

    userName:{
        type:String,
        required:true
    },
    orderAmount:{
        type:Number,
        required:true
    },
    deliveryAddress:{
        type:String,
        required:true
    },
    orderDate:{
        type:Date,
        required:true
    },
    orderStatus:{
        type:String,
        required:true
    },
    PaymentMethod:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model("Orders",orders);

