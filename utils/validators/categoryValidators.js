const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { default: slugify } = require("slugify");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Invalid : Category name is required")
    .isLength({ min: 3 })
    .withMessage("Invalid : Category must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Invalid : Category must be at max 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id format"),
  validatorMiddleware,
];
