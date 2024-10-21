const express = require("express");

const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidators");

const {
  getCategories,
  getSpecificCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryServices");
const subCategoriesRoute = require("./subCategoryRoutes");

const { protect, allowedTo } = require("../services/user/authServices");

const router = express.Router();
// console.log("getCategories",typeof getCategories);          // Should log "function"
// console.log("getSpecificCategory",typeof getSpecificCategory);    // Should log "function"
// console.log("createCategory",typeof createCategory);         // Should log "function"
// console.log("updateCategory",typeof updateCategory);         // Should log "function"
// console.log("deleteCategory",typeof deleteCategory);
//console.log("getCategoryValidator ---->",getCategoryValidator);

//router.post('/',);
router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getSpecificCategory)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

//Nested Route
router.use("/:categoryId/subCategories", subCategoriesRoute);

/* router.get('/',getCategories);
router.get('/:id',getSpecificCategory);
router.post('/',createCategory);
router.Put('/',updateCategory); */

module.exports = router;
