const mongoose = require("mongoose");

//Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minLength: [2, "Brand must be at least 2 characters"],
      maxLength: [32, "Brand must be less than 32 characters"],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
// GET & Update
brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});
// Create
brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

//Model
const BrandModel = new mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
