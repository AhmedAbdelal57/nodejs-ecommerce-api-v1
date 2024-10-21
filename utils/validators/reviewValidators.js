const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ReviewModel = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review Id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title")
    .notEmpty()
    .withMessage("Invalid : Review title is required")
    .isLength({ min: 1 })
    .withMessage("Invalid : Review title must be at least 2 characters")
    .isLength({ max: 100 })
    .withMessage("Invalid : Review title must be at max 32 characters"),
  check("rating")
    .notEmpty()
    .withMessage("Invalid : Review rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Invalid : Rating value must be between 1.0 and 5.0."),
  check("user").isMongoId().withMessage("Invalid User Id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Product ID format")
    .custom(async (val, { req }) => {
      // Check if the logged-in user has already created a review for the same product
      const review = await ReviewModel.findOne({
        user: req.user._id, // User who is trying to create the review
        product: req.body.product, // The product that is being reviewed
      });
      if (review) {
        return Promise.reject(
          new Error("Invalid: You already reviewed this product")
        );
      }
    }),
  validatorMiddleware,
];
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id format")
    .custom(async (val, { req }) => {
      // Check if the logged-in user is the owner of the review
      const review = await ReviewModel.findById(val);
      if (!review) {
        return Promise.reject(
          new Error(`Invalid: there is no Review with id ${val}`)
        );
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error("Invalid: you are Unauthorized to update this review")
        );
      }
    }),
  check("title")
    .notEmpty()
    .withMessage("Invalid : Review title is required")
    .isLength({ min: 1 })
    .withMessage("Invalid : Review title must be at least 2 characters")
    .isLength({ max: 100 })
    .withMessage("Invalid : Review title must be at max 32 characters"),
  check("rating")
    .notEmpty()
    .withMessage("Invalid : Review rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Invalid : Rating value must be between 1.0 and 5.0."),

  validatorMiddleware,
];
exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID format")
    .custom(async (val, { req }) => {
      // Check if the logged-in user is the owner of the review
      if (req.user.role === "user") {
        const review = await ReviewModel.findById(val);
        if (!review) {
          return Promise.reject(
            new Error(`Invalid: No review found with ID ${val}`)
          );
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(
              "Unauthorized: You do not have permission to delete this review"
            )
          );
        }
      }
      return true;
    }),
  validatorMiddleware,
];
