const mongoose = require("mongoose")

const users = mongoose.Schema({

    FName:{
        type:String,
        required:true
    },
    LName:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

})

module.exports  = mongoose.model("User",users);


