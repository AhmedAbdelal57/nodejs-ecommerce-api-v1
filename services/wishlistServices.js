const asyncHandler = require("express-async-handler");

const UserModel = require("../models/userModel");

// @desc   add product to wishlist
// @route  Post /api/v1/wishlist
// @access protected/user

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  // $addToSet  ==> add productId to wishlist array if productId not exist in this array
  const User = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: User.wishlist,
  });
});

// @desc   remove product from wishlist
// @route  Delete /api/v1/wishlist/:productId
// @access protected/user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;
  // $pull  ==> remove productId from wishlist array if productId exist in this array
  const User = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: productId } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist",
    data: User.wishlist,
  });
});
// @desc   Get Logged user  wishlist
// @route  Get /api/v1/wishlist
// @access protected/user
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const User = await UserModel.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "success",
    message: "get logged User  wishlist",
    data: User.wishlist,
  });
});
