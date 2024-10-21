const express = require("express");
/* const {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../utils/validators/CouponValidators"); */

const {
  getCoupons,
  getSpecificCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponServices");

const { protect, allowedTo } = require("../services/user/authServices");

const router = express.Router();
// becouse the all route used it
router.use(protect, allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCoupon);
router
  .route("/:id")
  .get(getSpecificCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

//Nested Route
//router.use("/:CouponId/subCoupons", subCouponsRoute);

/* router.get('/',getCoupons);
router.get('/:id',getSpecificCoupon);
router.post('/',createCoupon);
router.Put('/',updateCoupon); */

module.exports = router;
