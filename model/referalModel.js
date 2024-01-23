const mongoose = require("mongoose");

const referalSchema = mongoose.Schema({

    code:{
        type:String,
    },
    user: {
        type: mongoose.Types.ObjectId,
    },
    usedUsers:[
        {
            type: mongoose.Types.ObjectId,
        }
    ]

});

 module.exports = mongoose.model("Referal",referalSchema)