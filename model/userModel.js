const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Number,
    required: true,
  },
  is_varified: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
    default: "",
  },
  is_block: {
    type: Number,
    default: 0,
  },
  wishlist: 
    {
      items: [
        {
          productId: {
            type: String,
            ref:"Products"
            
          },
          proName: {
            type: String,
          },
          quantity: {
            type: Number,
          },
          price: {
            type: Number,
          },
          images: {
            type: Object,
          },
        },
      ],
    },
  
  wallet: {
    type: Number,
    default: 0,
  },
  walletHistory: [
    {
      date: {
        type: Date,
      },
      amount: {
        type: Number,
      },
      reason: {
        type: String,
      },
      direction: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
