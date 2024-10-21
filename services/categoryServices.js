const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");


//2-Memory Storage
//Multer Middleware to upload single images to categories
exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const uniqueFilename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${uniqueFilename}`);
  //save image into our database
  req.body.image = uniqueFilename;
  //console.log(req.file);
  next();
});
//@desc create category
//@route POST /api/v1/categories
//@access Private (admin)
exports.createCategory = factory.createOne(CategoryModel);
//@desc Get List of category
//@route Get /api/v1/categories
//@access Public
exports.getCategories = factory.getAll(CategoryModel);
//@desc Get Specific  category by id
//@route Get /api/v1/categories/:id
//@access Public
exports.getSpecificCategory = factory.getOne(CategoryModel);
//@desc Update Specific  category by id
//@route PUT /api/v1/categories/:id
//@access Private (admin)
exports.updateCategory = factory.updateOne(CategoryModel);
//@desc Delete Specific  category by id
//@route Delete /api/v1/categories/:id
//@access Private (admin)
exports.deleteCategory = factory.deleteOne(CategoryModel);
