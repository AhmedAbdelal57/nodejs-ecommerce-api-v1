const ReviewModel = require("../models/reviewModel");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");

const sharp = require("sharp");

//2-Memory Storage
//Multer Middleware to upload single images to categories
//exports.uploadBrandImage = uploadSingleImage("image");

//@desc create review
//@route POST /api/v1/reviews
//@access Private/protect (user)
exports.createReview = factory.createOne(ReviewModel);
//@desc Get List of review
//@route Get /api/v1/reviews
//@access Public
exports.getReviews = factory.getAll(ReviewModel);
//@desc Get Specific  review by id
//@route Get /api/v1/reviews/:id
//@access Public
exports.getSpecificReview = factory.getOne(ReviewModel);
//@desc Update Specific  review by id
//@route PUT /api/v1/reviews/:id
//@access Private/protect (user)
exports.updateReview = factory.updateOne(ReviewModel);
//@desc Delete Specific  review by id
//@route Delete /api/v1/reviews/:id
//@access Private/protect (user,admin,manger)
exports.deleteReview = factory.deleteOne(ReviewModel);
//Nested route
//Get /api/v1/products/:id/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};
//Nested route
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
