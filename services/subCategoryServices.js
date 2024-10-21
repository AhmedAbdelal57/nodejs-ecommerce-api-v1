const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setcategoryIdToBody = (req, res, next) => {
  //Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//Nested route
//Get /api/v1/categories/:id/subCategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

//@desc create category
//@route POST /api/v1/subCategory
//@access Private (admin)
exports.createSubCategory = factory.createOne(subCategoryModel);
//@desc Get List of subCategory
//@route Get /api/v1/subCategories
//@access Public
exports.getSubCategories = factory.getAll(subCategoryModel);
//@desc Get Specific  subCategory by id
//@route Get /api/v1/subCategories/:id
//@access Public
exports.getSpecificSubCategory = factory.getOne(subCategoryModel);
//@desc Update Specific  subCategory by id
//@route PUT /api/v1/subCategories/:id
//@access Private (admin)
exports.updateSubCategory = factory.updateOne(subCategoryModel);
//@desc Delete Specific  subCategory by id
//@route Delete /api/v1/subCategories/:id
//@access Private (admin)
exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
