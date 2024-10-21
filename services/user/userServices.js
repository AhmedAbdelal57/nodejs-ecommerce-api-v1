const UserModel = require("../../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const factory = require("../handlersFactory");
const bcrypt = require("bcryptjs");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const {
  uploadSingleImage,
} = require("../../middlewares/uploadImageMiddleware");

//2-Memory Storage
//Multer Middleware to upload single images to users
exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const uniqueFilename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${uniqueFilename}`);
  //save image into our database
  req.body.profileImage = uniqueFilename;
  //console.log(req.file);
  next();
});

//@desc create User
//@route POST /api/v1/Users
//@access Private (admin)
exports.createUser = factory.createOne(UserModel);
//@desc Get List of User
//@route Get /api/v1/Users
//@access Public
exports.getUsers = factory.getAll(UserModel);
//@desc Get Specific  User by id
//@route Get /api/v1/Users/:id
//@access Private (admin)
exports.getSpecificUser = factory.getOne(UserModel);
//@desc Update Specific  User by id
//@route PUT /api/v1/Users/:id
//@access Private (admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const doc = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!doc) {
    //res.status(404).json({ message: `No Product found with id : ${id}` });
    return next(new ApiError(`No document found with id : ${id}`, 404));
  }
  res.status(200).json({
    message: `Document with id : ${id} has been Updated`,
    data: doc,
  });
});
//@desc Delete Specific  User by id
//@route Delete /api/v1/Users/:id
//@access Private (admin)
exports.deleteUser = factory.deleteOne(UserModel);

//@desc Update Specific  User Password by id
//@route PUT /api/v1/Users/:id
//@access Private (admin)
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const doc = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!doc) {
    //res.status(404).json({ message: `No Product found with id : ${id}` });
    return next(new ApiError(`No document found with id : ${id}`, 404));
  }
  res.status(200).json({
    message: `Document with id : ${id} has been Updated`,
    data: doc,
  });
});
