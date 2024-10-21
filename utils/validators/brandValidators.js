const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { default: slugify } = require("slugify");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Invalid : Brand name is required")
    .isLength({ min: 2 })
    .withMessage("Invalid : Brand must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("Invalid : Brand must be at max 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id format"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id format"),
  validatorMiddleware,
];
