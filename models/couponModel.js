const mongoose = require("mongoose");

//schema
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name required"],
      trim: true,
      unique: true,
      minlength: [2, "Coupon name must be at least 2 characters"],
      maxlength: [100, "Coupon name must be less than 100 characters"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expiration date required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value required"],
    },
  },
  { timestamps: true }
);

const CouponModel = new mongoose.model("Coupon", couponSchema);

module.exports = CouponModel;
