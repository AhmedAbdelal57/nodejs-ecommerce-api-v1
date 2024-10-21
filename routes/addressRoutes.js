const express = require("express");

const {
  addaddress,
  getLoggedUserAddresses,
  removeaddressFromAddresses,
} = require("../services/addressServices");
//const subBrandsRoute = require("./subBrandRoutes");

const { protect, allowedTo } = require("../services/user/authServices");

const router = express.Router();

router
  .route("/")
  .get(protect, allowedTo("admin", "manager", "user"), getLoggedUserAddresses)
  .post(protect, allowedTo("user"), addaddress);
router
  .route("/:addressId")
  .delete(protect, allowedTo("user"), removeaddressFromAddresses);

module.exports = router;
