const { check, body } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const { default: slugify } = require("slugify");
const UserModel = require("../../../models/userModel");
const bcrypt = require("bcryptjs");

exports.signupValidator = [
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

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Invalid : Email is required")
    .isEmail()
    .withMessage("Invalid : Email address"),
  check("password")
    .notEmpty()
    .withMessage("Invalid : Password is required")
    .isLength({ min: 6 })
    .withMessage("Invalid : Password must be at least 6 characters"),

  validatorMiddleware,
];
