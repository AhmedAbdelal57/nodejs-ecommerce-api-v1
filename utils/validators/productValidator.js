const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const CategoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");
const { default: slugify } = require("slugify");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id format"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Invalid : Title must be at least 3 characters")
    .notEmpty()
    .withMessage("Invalid : Title Product must be required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Invalid : Product description is required")
    .isLength({ min: 10 })
    .withMessage("Invalid : Product description must be at least 10 characters")
    .isLength({ max: 1024 })
    .withMessage(
      "Invalid : Product description must be at max 1024 characters"
    ),
  check("quantity")
    .notEmpty()
    .withMessage("Invalid : Product quantity must be required")
    .isNumeric()
    .withMessage("Invalid : Product quantity must be a number")
    .isInt({ gt: 0 })
    .withMessage("Invalid : Product quantity must be a positive integer"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Invalid : Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Invalid : Product price is required")
    .isNumeric()
    .withMessage("Invalid : Product price must be a number")
    .isLength({ max: 10 })
    .withMessage("Invalid : To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Invalid : Product price must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Price after discount must be less than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Invalid : available colors should be an array of String"),
  check("imageCover").notEmpty().withMessage("Invalid: imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Invalid : Product images should be an array of String"),
  check("category")
    .notEmpty()
    .withMessage("Invalid : Product must be belonge to category")
    .isMongoId()
    .withMessage("Invalid : Invalied ID formate")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`Invalid : Category with id ${categoryId} not found`)
          );
        }
      })
    ),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid : invalied ID formate")
    .custom((subCategoriesIds) =>
      subCategoryModel
        .find({ _id: { $exists: true, $in: subCategoriesIds } })
        .then((result) => {
          //length of result = to length of subCategories
          if (result.length < 1 || result.length !== subCategoriesIds.length) {
            return Promise.reject(
              new Error(
                `Invalid : subCategory with id ${subCategoriesIds} not found`
              )
            );
          }
        })
    )
    .custom((value, { req }) =>
      subCategoryModel
        .find({ category: req.body.category })
        .then((subCategories) => {
          const subCategoriseIdsInDB = [];
          subCategories.forEach((subCategory) => {
            subCategoriseIdsInDB.push(subCategory._id.toString());
          });
          console.log(
            "subCategories Id of this category is ==> ",
            subCategoriseIdsInDB
          );
          //check if subCategories in DB includes subcategories in req.body.category(true,false)
          if (!value.every((item) => subCategoriseIdsInDB.includes(item))) {
            return Promise.reject(
              new Error("Invalid : subCategories not belong to category ")
            );
          }
        })
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid : invalied ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Invalid : ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Invalid : ratingsAverage must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Invalid : ratingsAverage must be below or equal 5.0"),
  check("numOfReviews")
    .optional()
    .isNumeric()
    .withMessage("Invalid : numOfReviews must be a number"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product Id format"),
  validatorMiddleware,
];
