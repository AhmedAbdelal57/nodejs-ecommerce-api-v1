const CouponModel = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

//@desc create coupon
//@route POST /api/v1/coupones
//@access Private (admin/manager)
exports.createCoupon = factory.createOne(CouponModel);
//@desc Get List of coupons
//@route Get /api/v1/coupones
//@access Private (admin/manager)
exports.getCoupons = factory.getAll(CouponModel);
//@desc Get Specific  coupon by id
//@route Get /api/v1/coupons/:id
//@access Private (admin/manager)
exports.getSpecificCoupon = factory.getOne(CouponModel);
//@desc Update Specific  coupon by id
//@route PUT /api/v1/coupones/:id
//@access Private (admin/manager)
exports.updateCoupon = factory.updateOne(CouponModel);
//@desc Delete Specific  coupon by id
//@route Delete /api/v1/coupones/:id
//@access Private (admin/manager)
exports.deleteCoupon = factory.deleteOne(CouponModel);
