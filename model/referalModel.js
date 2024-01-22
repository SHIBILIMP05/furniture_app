const mongoose = require("mongoose");

const referalSchema = mongoose.Schema({

    referalCode:{
        type:String,
        required:true
    },
    amount: {
        type: Number,
        required: true,
    },
    usersUsed: {
        type: Number,
        default: 0,
    },
    Date: {
        type: Date,
    },
    is_block: {
        type: Number,
        default: 0,
    },

});

 module.exports = mongoose.model("Referal",referalSchema)