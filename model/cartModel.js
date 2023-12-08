const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({

    userId: {
        type: String,
        required: true,
        ref: "User",
      },
      userName: {
        type: String,
        required: true,
      },
      applied:{
        type: String,
        default: "not"
      },
      products: [
        {
          productId: {
            type: String,
            required: true,
            ref: "Products",
          },
          count: {
            type: Number,
            default: 1,
          },
          productPrice: {
            type: Number,
            required: true,
          },
          totalPrice: {
            type: Number,
            default: 0,
          },
          image:{
            type:String,
            required:true
          },
          proName:{
            type:String,
            required:true
          },
          category:{
            type:String,
            required:true
          }

        },
      ],
    });

module.exports = mongoose.model("Cart",cartSchema);

