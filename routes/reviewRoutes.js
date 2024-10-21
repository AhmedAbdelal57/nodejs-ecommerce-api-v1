const express = require("express");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidators");

const {
  getReviews,
  getSpecificReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviewServices");

const { protect, allowedTo } = require("../services/user/authServices");
// mergeParams: Allow us to access parameters on other routers
//we need to access categoryId from category Route
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    protect,
    allowedTo("admin", "user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getSpecificReview)
  .put(protect, allowedTo("user", "admin"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowedTo("user", "manager", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
