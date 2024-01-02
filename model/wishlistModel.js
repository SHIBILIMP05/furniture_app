const mongoose = require("mongoose")

const wishlistSchema = mongoose.Schema({

    userId:{
        type:String,
        required:true
    },
    proName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    images:{
        type:Object,
        required:true
    }
    

})

module.exports = mongoose.model("Wishilist",wishlistSchema);

