const asyncHandler = require("express-async-handler");

const UserModel = require("../models/userModel");

// @desc   add address to user Addresses list
// @route  Post /api/v1/addresses
// @access protected/user

exports.addaddress = asyncHandler(async (req, res, next) => {
  // $addToSet  ==> add Address to Addresses array if Address not exist in this array
  const User = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Address added successfully to your Addresses list",
    data: User.addresses,
  });
});

// @desc   remove address from Addresses list
// @route  Delete /api/v1/addresses/:addressId
// @access protected/user
exports.removeaddressFromAddresses = asyncHandler(async (req, res, next) => {
  const addressId = req.params.addressId;
  // $pull  ==> remove address from Addresses array if address exist in this array
  const User = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address removed successfully from your Addresses list",
    data: User.addresses,
  });
});
// @desc   Get Logged user  Addresses
// @route  Get /api/v1/addresses
// @access protected/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const User = await UserModel.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    message: "get logged User  addresses",
    results: User.addresses.length,
    data: User.addresses,
  });
});
