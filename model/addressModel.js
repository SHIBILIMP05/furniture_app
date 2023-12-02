const mongoose = require("mongoose")

const addresSchema = mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      address: [
        {
          fullname: {
            type: String,
            required: true,
            trim: true,
          },
          mobile: {
            type: Number,
            required: true,
            trim: true,
          },
    
          email: {
            type: String,
            required: true,
            trim: true,
          },
          houseName: {
            type: String,
            required: true,
            trim: true,
          },
          city: {
            type: String,
            required: true,
            trim: true
          },
          state: {
            type: String,
            required: true,
            trim: true
          },
    
          pin: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
})

module.exports = mongoose.model("Address",addresSchema);

