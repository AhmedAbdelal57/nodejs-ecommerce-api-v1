const BrandModel = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

//2-Memory Storage
//Multer Middleware to upload single images to categories
exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const uniqueFilename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${uniqueFilename}`);
  //save image into our database
  req.body.image = uniqueFilename;
  //console.log(req.file);
  next();
});

//@desc create Brand
//@route POST /api/v1/Brandes
//@access Private (admin)
exports.createBrand = factory.createOne(BrandModel);
//@desc Get List of Brand
//@route Get /api/v1/Brandes
//@access Public
exports.getBrands = factory.getAll(BrandModel);
//@desc Get Specific  Brand by id
//@route Get /api/v1/Brands/:id
//@access Public
exports.getSpecificBrand = factory.getOne(BrandModel);
//@desc Update Specific  Brand by id
//@route PUT /api/v1/Brandes/:id
//@access Private (admin)
exports.updateBrand = factory.updateOne(BrandModel);
//@desc Delete Specific  Brand by id
//@route Delete /api/v1/Brandes/:id
//@access Private (admin)
exports.deleteBrand = factory.deleteOne(BrandModel);
