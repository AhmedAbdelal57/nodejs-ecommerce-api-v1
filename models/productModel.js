const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      maxLength: [10, "Too short product priceeeeee"],
    },
    priceAfterDescount: {
      type: Number,
      trim: true,
      maxLength: [10, "Too short product price"],
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product imageCover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product  must belong to a category"],
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        //required: [true, "Product  must belong to a subCategory"],
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    //to enable virtual population
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
    //select: "name -_id",
  });
  next();
});

const setImageUrl = (doc) => {
  //return image base URL + image path
  if (doc.imageCover) {
    const imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageCoverUrl;
  }
  if (doc.images) {
    imageList = [];
    doc.images.map((img) => {
      const imageUrl = `${process.env.BASE_URL}/products/${img}`;
      imageList.push(imageUrl);
    });
  }
  doc.images = imageList;
};
// GET & Update
productSchema.post("init", (doc) => {
  setImageUrl(doc);
});
// Create
productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
  //justOne: false,
});
const ProductModel = new mongoose.model("Product", productSchema);

module.exports = ProductModel;

//In this file, we're creating a schema for a product using Mongoose, and then creating a model for this schema.
// We're also defining some required fields and their validation rules.
