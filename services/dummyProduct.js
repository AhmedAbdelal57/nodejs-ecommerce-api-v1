const ProductModel = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

//@desc create Product
//@route POST /api/v1/products
//@access Private (admin)
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  console.log(`body is : ${req.body.slug}`);
  const Product = await ProductModel.create(req.body);
  res.status(201).json({ data: Product });
});
//@desc Get List of Product
//@route Get /api/v1/products
//@access Public
exports.getProducts = asyncHandler(async (req, res) => {
  //to delete unused parameters from req.query
  // 1)- Filtering

  /* const queryStringObject = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((field) => delete queryStringObject[field]);
  // { ratingsAverage: { $gte: 4 }, price: { $gte: 50 } }  true
  //filtering using [gte,gt,lte,lt] operators
  let queryStr = JSON.stringify(queryStringObject);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log("Before", req.query);
  console.log("After", queryStringObject);
  console.log(JSON.parse(queryStr)); */
  // 2)- pagination

  /*  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit; */

  //Build query
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .limitFields()
    .sort();

  /* var mongooseQuery = ProductModel.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" }); */

  //Execute query
  const Products = await apiFeatures.mongooseQuery;

  res.status(200).json({ results: Products.length,  data: Products });

  // 3)- Sorting
  /* if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log("sorted By", sortBy);
    mongooseQuery = mongooseQuery.sort(sortBy);
  } */

  //4)- fields
  /* if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    console.log("fields is", fields);
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  } */

  //5)- search

  /* if (req.query.keyword) {
    const searchQuery = {
      $or: [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ],
    };
    console.log("search keyword", searchQuery.$or);
    console.log("Final search query:", JSON.stringify(searchQuery, null, 2));
    mongooseQuery = ProductModel.find(searchQuery);
  } */

  //results number of Products  , data is array of Products
});
//@desc Get Specific  Product by id
//@route Get /api/v1/products/:id
//@access Public
exports.getSpecificProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!Product) {
    //res.status(404).json({ message: `No Product found with id : ${id}` });
    return next( new ApiError(`No Product found with id : ${id}`, 404));
  }
  res.status(200).json({ data: Product });
});
//@desc Update Specific  Product by id
//@route PUT /api/v1/products/:id
//@access Private (admin)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.title = slugify(req.body.title);
  }
  const Product = await ProductModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!Product) {
    //res.status(404).json({ message: `No Product found with id : ${id}` });
    return next(new ApiError(`No Product found with id : ${id}`, 404));
  }
  res.status(200).json({
    message: `Product with id : ${id} has been Updated`,
    data: Product,
  });
});
//@desc Delete Specific  product by id
//@route Delete /api/v1/products/:id
//@access Private (admin)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Product = await ProductModel.findByIdAndDelete(id);
  if (!Product) {
    //res.status(404).json({message : `No Product found with id : ${id}`});
    return next(new ApiError(`No Product found with id : ${id}`, 404));
  }
  res.status(200).json({ message: `Product with id : ${id} has been deleted` });
});
