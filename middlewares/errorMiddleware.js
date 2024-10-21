const ApiError = require("../utils/apiError");

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
    system: process.env.NODE_ENV,
  });
};

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    system: "production",
  });
};

const handleJwtInvalidSignature = () => {
  return new ApiError("Invalid token, please login again", 401);
};
const handleExpiredJwt = () => {
  return new ApiError("Expired token, please login again", 401);
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // For development mode
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  }
  // For production mode
  else if (process.env.NODE_ENV === "production") {
    // Handle specific JWT error
    if (err.name === "JsonWebTokenError") {
      err = handleJwtInvalidSignature(); // Assign new ApiError instance to `err`
    }
    if (err.name === "TokenExpiredError") {
      err = handleExpiredJwt(); // Assign new ApiError instance to `err`
    }
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
