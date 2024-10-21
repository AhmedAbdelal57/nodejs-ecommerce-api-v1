const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../../utils/validators/user/authValidators");

const {
  signup,
  login,
  protect,
  forgotPassword,
} = require("../../services/user/authServices");
//const subBrandsRoute = require("./subBrandRoutes");

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
/* router
  .route("/:id")
  .get(getUserValidator, getSpecificUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser); */

module.exports = router;
