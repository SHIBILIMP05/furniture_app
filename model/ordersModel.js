const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({

    deliveryDetails: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Types.ObjectId,
      },
      uniqueId: {
        type: Number,
      },
      userId: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      products: [
        {
          productId: {
            type: String,
            required: true,
            ref: "product",
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
            required: true,
          }
        },
      ],
      
      deliveryDate: {
        type: Date,
      },
      cancelReason: {
        type: String
      },
      returnReason: {
        type: String
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
      },
      status: {
        type: String,
      },
      statusLevel: {
        type: Number,
        default: 0
      },
      paymentMethod: {
        type: String,
      },
      orderId: {
        type: String,
      },
      paymentId: {
        type: String
      },
      discount: {
        type: String
      }
    });

module.exports = mongoose.model("Orders",orderSchema);

