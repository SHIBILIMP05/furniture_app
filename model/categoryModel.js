const mongoose = require("mongoose");

const categorySchema = mongoos.Schema({

    name:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }

});

 module.exports = mongoose.model("Category",categorySchema)