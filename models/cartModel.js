const mongoose = require("mongoose");

//schema
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
        color: String,
        price: Number,
        //other fields like size, color, etc. can be added here
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const CartModel = new mongoose.model("Cart", cartSchema);

module.exports = CartModel;
