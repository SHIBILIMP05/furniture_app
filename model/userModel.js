const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    },
    is_block:{
        type:Number,
        default:0
    },
    wallet:{
        type:Number,
        default:0
    },
    walletHistory:[{
        date:{
            type:Date
        },
        amount:{
            type:Number
        }
    }]

})

module.exports  = mongoose.model("User",userSchema);


