const mongoose = require("mongoose");
const ProductModel = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      //required: [true, "Review title is required"],
      minlength: [1, "Review title must be at least 1 characters"],
      maxlength: [100, "Review title must be less than 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Review rating is required"],
      min: [1, "Min rating value is 1.0"],
      max: [5, "Max rating value is 5.0"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuality = async function (productId) {
  const result = await this.aggregate([
    // stage 1 : get all reviews in specific product
    {
      $match: { product: productId },
    },
    // stage  : grouping reviews based on productId and calculate average ratings, quantity
    {
      $group: {
        _id: "$product",
        numOfReviews: { $sum: 1 },
        ratingsAverage: { $avg: "$rating" },
      },
    },
  ]);
  //console.log(result);
  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      numOfReviews: result[0].numOfReviews,
      ratingsAverage: result[0].ratingsAverage,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      numOfReviews: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuality(this.product);
});

reviewSchema.pre("deleteOne", { document: true }, async function () {
  // Runs when you call `Model.findOneAndDelete()`
  await this.constructor.calcAverageRatingsAndQuality(this.product);
});
module.exports = mongoose.model("Review", reviewSchema);
