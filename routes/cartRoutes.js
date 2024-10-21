const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItems,
  clearLoggedUserCart,
  updateCartItemQuantity,
  applyCouponOnCart,
} = require("../services/cartServices");

const { protect, allowedTo } = require("../services/user/authServices");

const router = express.Router();
router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearLoggedUserCart);
router.route("/applyCoupon").put(applyCouponOnCart);
router
  .route("/:itemId")
  .delete(removeSpecificCartItems)
  .put(updateCartItemQuantity);

module.exports = router;
