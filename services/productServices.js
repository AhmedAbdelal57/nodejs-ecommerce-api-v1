const ProductModel = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const ApiError = require("../utils/apiError");
const { uploadMixImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);
// req.files is an object
exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  //console.log(req.files);
  //1-image processing for imageCover
  if (req.files.imageCover) {
    const ImageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${ImageCoverFilename}`);
    //save image into our database
    req.body.imageCover = ImageCoverFilename;
    //console.log(req.file);
  }
  //2-image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (imag, index) => {
        const ImagesFilename = `product-${uuidv4()}-${Date.now()}-${
          index + 1
        }.jpeg`;
        await sharp(imag.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${ImagesFilename}`);
        //save image into our database
        req.body.images.push(ImagesFilename);
      })
    );

    //console.log(req.body.imageCover);
    //console.log(req.body.images);
    next();
  }
});

//@desc create Product
//@route POST /api/v1/products
//@access Private (admin)
exports.createProduct = factory.createOne(ProductModel);
//@desc Get List of Product
//@route Get /api/v1/products
//@access Public
exports.getProducts = factory.getAll(ProductModel, "product");
// exports.getProducts = asyncHandler(async (req, res) => {
//   //Build query
//   const documentCounts = await ProductModel.countDocuments();
//   const apiFeatures = new ApiFeatures(
//     ProductModel.find(),
//     ProductModel,
//     req.query
//   )
//     .paginate(documentCounts)
//     .filter()
//     .search("product")
//     .limitFields()
//     .sort();

//   //Execute query
//   const { mongooseQuery, paginationResult } = apiFeatures;
//   const Products = await mongooseQuery;

//   res
//     .status(200)
//     .json({ results: Products.length, paginationResult, data: Products });

//   //results number of Products  , data is array of Products
// });
//@desc Get Specific  Product by id
//@route Get /api/v1/products/:id
//@access Public
exports.getSpecificProduct = factory.getOne(ProductModel, "reviews");
//@desc Update Specific  Product by id
//@route PUT /api/v1/products/:id
//@access Private (admin)
exports.updateProduct = factory.updateOne(ProductModel);
//@desc Delete Specific  product by id
//@route Delete /api/v1/products/:id
//@access Private (admin)
exports.deleteProduct = factory.deleteOne(ProductModel);
