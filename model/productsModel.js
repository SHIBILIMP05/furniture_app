const mongoose = require("mongoose")

const productSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    img:{
        type:binery,
        required:true
    }

})

module.exports = mongoose.model("Products",productSchema);
