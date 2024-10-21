const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setcategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryServices");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidators");

const { protect, allowedTo } = require("../services/user/authServices");
// mergeParams: Allow us to access parameters on other routers
//we need to access categoryId from category Route
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getSubCategories)
  .post(
    protect,
    allowedTo("admin", "manager"),
    setcategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSpecificSubCategory)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
