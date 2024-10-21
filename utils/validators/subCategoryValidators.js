const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { default: slugify } = require("slugify");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Invalid : subCategory name is required")
    .isLength({ min: 2 })
    .withMessage("Invalid : subCategory must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("Invalid : subCategory must be at least 3 characters"),
  check("category")
    .notEmpty()
    .withMessage("Invalid: subCategory must be belong to Category")
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id format"),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id format"),
  validatorMiddleware,
];
