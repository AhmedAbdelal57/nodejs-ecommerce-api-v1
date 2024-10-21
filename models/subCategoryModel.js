const mongoose = require("mongoose");

//Schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //to remove  spaces
      unique: [true, "SubCategory must be unique"],
      minLength: [2, "SubCategory must be at least 3 characters"],
      maxLength: [32, "SubCategory must be less than 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to parent category"],
    },
  },
  { timestamps: true }
);

const subCategoryModel = new mongoose.model("SubCategory", subCategorySchema);

module.exports = subCategoryModel;
