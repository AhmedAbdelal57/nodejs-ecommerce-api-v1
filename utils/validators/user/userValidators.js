const { check, body } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const { default: slugify } = require("slugify");
const UserModel = require("../../../models/userModel");
const bcrypt = require("bcryptjs");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Invalid : User name is required")
    .isLength({ min: 2 })
    .withMessage("Invalid : Name must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Invalid : Name is too large")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Invalid : Email is required")
    .isEmail()
    .withMessage("Invalid : Email rong format")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Invalid : Password is required")
    .isLength({ min: 6 })
    .withMessage("Invalid : Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error(
          "Invalid :Password confirmation does not match password"
        );
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Invalid : Password confirmation is required"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "en-US", "ar-SA"])
    .withMessage("Invalid : Phone number is not valid"),

  check("profileImage").optional(),

  check("role")
    .optional()
    .isIn(["user", "admin", "manager"])
    .withMessage("Invalid : Role Entry does not exist"),
  validatorMiddleware,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Invalid : Email is required")
    .isEmail()
    .withMessage("Invalid : Email rong format")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "en-US", "ar-SA"])
    .withMessage("Invalid : Phone number is not valid"),

  check("profileImage").optional(),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Invalid : Role Entry does not exist"),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  check("currentPassword").notEmpty().withMessage("Invalid : Current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Invalid : Password confirmation is required"),
  body("password")
    .notEmpty()
    .withMessage("Invalid : Password is required")
    .isLength({ min: 6 })
    .withMessage("Invalid : Password must be at least 6 characters")
    .custom(async (val, { req }) => {
      //1) verify current password
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error("Invalid : There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Invalid : Current password is incorrect");
      }
      //2) verify password Confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error(
          "Invalid :Password confirmation does not match password"
        );
      }
      return true;
    }),

  validatorMiddleware,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  validatorMiddleware,
];
