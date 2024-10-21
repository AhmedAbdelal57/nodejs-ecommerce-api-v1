const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

//@desc create document
//@route POST /api/v1/factor
//@access Private (admin)
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

//@desc Get List of document
//@route Get /api/v1/factor
//@access Public
exports.getAll = (Model, type = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    //Build query
    const documentCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), Model, req.query)
      .paginate(documentCounts)
      .filter()
      .search(type)
      .limitFields()
      .sort();

    //Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const doc = await mongooseQuery;

    res.status(200).json({ results: doc.length, paginationResult, data: doc });
    //results number of doc  , data is array of doc
  });

//@desc Get Specific  document by id
//@route Get /api/v1/factor/:id
//@access Public
exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 2- Build the query
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    // 2- Execute the query
    const doc = await query;
    if (!doc) {
      //res.status(404).json({ message: `No document found with id : ${id}` });
      return next(new ApiError(`No document found with id : ${id}`, 404));
    }
    res.status(200).json({ data: doc });
  });

//@desc Delete Specific  document by id
//@route Delete /api/v1/factor/:id
//@access Private (admin)
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new ApiError("No document found with that ID", 404));
    }
    // Trigger remove event when delete doc
    await doc.deleteOne(); // Correct method to remove the document
    res.status(204).json({
      status: "success",
      result: "Document deleted successfully",
      data: null,
    });
  });

//@desc Update Specific  document by id
//@route PUT /api/v1/factor/:id
//@access Private (admin)
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      //res.status(404).json({ message: `No Product found with id : ${id}` });
      return next(new ApiError(`No document found with id : ${id}`, 404));
    }
    // Trigger save event when update doc
    doc.save();
    res.status(200).json({
      message: `Document with id : ${id} has been Updated`,
      data: doc,
    });
  });
