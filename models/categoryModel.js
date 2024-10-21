const mongoose = require("mongoose");

//Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Category must be at least 3 characters"],
      maxLength: [32, "Category must be less than 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  //return image base URL + image path
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// GET & Update
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});
// Create
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

//Model
const CategoryModel = new mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
