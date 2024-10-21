const express = require("express");

const {
  addProductToWishlist,
  getLoggedUserWishlist,
  removeProductFromWishlist,
} = require("../services/wishlistServices");
//const subBrandsRoute = require("./subBrandRoutes");

const { protect, allowedTo } = require("../services/user/authServices");

const router = express.Router();

router
  .route("/")
  .get(protect, allowedTo("admin", "manager", "user"), getLoggedUserWishlist)
  .post(protect, allowedTo("user"), addProductToWishlist);
router
  .route("/:productId")
  .delete(protect, allowedTo("user"), removeProductFromWishlist);

//Nested Route
//router.use("/:BrandId/subBrands", subBrandsRoute);

/* router.get('/',getBrands);
router.get('/:id',getSpecificBrand);
router.post('/',createBrand);
router.Put('/',updateBrand); */

module.exports = router;
