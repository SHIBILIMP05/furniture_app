const mongoose = require("mongoose");

const category = mongoos.Schema({

    name:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }

});

 module.exports = mongoose.model("Category",category)