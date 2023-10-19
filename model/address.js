const mongoose = require("mongoose")

const address = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    place:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model("Address",address);

