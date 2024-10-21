const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ApiError = require("../../utils/apiError");
const UserModel = require("../../models/userModel");
const sendEmail = require("../../utils/sendEmail");

const generateToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

//@desc create User
//@route POST /api/v1/auth/signup
//@access Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create User
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordbeforeHash: req.body.password,
    phone: req.body.phone,
  });
  // 2- token
  const token = generateToken(user._id);
  // 3- Send Response
  res.status(201).json({
    status: "success",
    data: user,
    token,
  });
});

//@desc login User
//@route POST /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1- check if email & password is in body
  // 2- check if user exists and password is correct
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Wrong email or password", 401));
  }
  // 3- generate token
  const token = generateToken(user._id);
  // 4- send response
  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // 1-check if token exist in req headers

  //console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //console.log(token);
  if (!token) {
    return next(
      new ApiError(
        "You are not logged in ,Please login to access this rout",
        401
      )
    );
  }
  // 2-verify token (no change happens,expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //console.log(decoded);
  // 3- check if user exists
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token does no longer exist", 401)
    );
  }
  // 4- check if user changed password after the token created

  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed password, please login again...",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

// ["admin" , ",manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1- Access Roles
    // 2- Access reqisted user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(`you are not allowed to access this route`, 403)
      );
    }
    next();
  });

//@desc forgot password
//@route POST /api/v1/auth/forgotPassword
//@access Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1- Get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  console.log(user.email);
  if (!user) {
    return next(new ApiError("There is no user with this email", 404));
  }
  // 2- if user exist , Generate reset random 6 digit code and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  console.log(resetCode, "===>", hashedResetCode);
  // save reset code in db
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10min
  user.passwordResetVerified = false;
  await user.save();

  // 3- send reset code to user email
  const message = `Hi ${user.name}, \n we received a request to reset your password on your account.  \n Your reset code is : ${resetCode}.\n  thanks, `;
  await sendEmail({
    email: user.email,
    subject: "Reset Password valid for 10 minutes",
    message: message,
  });
  res.status(200).json({
    status: "success",
    message: "Code sent to your email",
  });
});
