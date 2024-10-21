const express = require("express");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidators");

const {
  getBrands,
  getSpecificBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandServices");
//const subBrandsRoute = require("./subBrandRoutes");

const { protect, allowedTo } = require("../services/user/authServices");

const router = express.Router();
// console.log("getBrands",typeof getBrands);          // Should log "function"
// console.log("getSpecificBrand",typeof getSpecificBrand);    // Should log "function"
// console.log("createBrand",typeof createBrand);         // Should log "function"
// console.log("updateBrand",typeof updateBrand);         // Should log "function"
// console.log("deleteBrand",typeof deleteBrand);
//console.log("getBrandValidator ---->",getBrandValidator);

//router.post('/',);
router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getSpecificBrand)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

//Nested Route
//router.use("/:BrandId/subBrands", subBrandsRoute);

/* router.get('/',getBrands);
router.get('/:id',getSpecificBrand);
router.post('/',createBrand);
router.Put('/',updateBrand); */

module.exports = router;
