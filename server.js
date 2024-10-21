const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

dotenv.config({ path: "config.env" });
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
//Routes
const mountRoutes = require("./routes/index.js");

//Connect to database
dbConnection();

//express app
const app = express();
//Middleware
app.use(express.json());
//serv image
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode is : ${process.env.NODE_ENV}`);
}
//Schema

//Model

// //Mount Routes

mountRoutes(app);
// //http://localhost:8000/api/v1/categories
// app.use("/api/v1/users", userRoutes);

//if route is not exist
app.all("*", (req, res, next) => {
  //create error and send it to error handeling middleware
  // const err = new Error(`Can't find this Route : ${req.originalUrl}`);
  // next(err.message)
  // ApiError Class
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));
});

//Global Error Handeler Middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Handelling Errors externally Express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors: ${err}`);
  server.close(() => {
    console.log("shutting down server");
    process.exit(1); //sutdown app
  });
});
