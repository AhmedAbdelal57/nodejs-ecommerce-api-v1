const express = require("express");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getSpecificProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImage,
} = require("../services/productServices");

const { protect, allowedTo } = require("../services/user/authServices");

const router = express.Router();

//Nested Route
const reviewRoutes = require("../routes/reviewRoutes");
router.use("/:productId/reviews", reviewRoutes);

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImage,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getSpecificProduct)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
