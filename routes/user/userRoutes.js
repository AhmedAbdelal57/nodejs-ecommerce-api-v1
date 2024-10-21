const express = require("express");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../../utils/validators/user/userValidators");

const {
  getUsers,
  getSpecificUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} = require("../../services/user/userServices");

const { protect, allowedTo } = require("../../services/user/authServices");
//const subBrandsRoute = require("./subBrandRoutes");

const router = express.Router();
// console.log("getUsers",typeof getUsers);          // Should log "function"
// console.log("getSpecificUser",typeof getSpecificUser);    // Should log "function"
// console.log("createUser",typeof createUser);         // Should log "function"
// console.log("updateUser",typeof updateUser);         // Should log "function"
// console.log("deleteUser",typeof deleteUser);
//console.log("getUserValidator ---->",getUserValidator);

//router.post('/',);
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(protect, allowedTo("admin"), getUsers)
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(protect, allowedTo("admin"), getUserValidator, getSpecificUser)
  .put(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(protect, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
