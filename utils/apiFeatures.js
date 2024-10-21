const ProductModel = require("../models/productModel");

class ApiErrorFeatures {
  constructor(mongooseQuery, model, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.model = model;
    this.queryString = queryString;
  }

  // 1)- Filtering
  filter() {
    //to delete unused parameters from req.query
    const queryStringObject = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryStringObject[field]);
    // { ratingsAverage: { $gte: 4 }, price: { $gte: 50 } }  true
    //filtering using [gte,gt,lte,lt] operators
    let queryStr = JSON.stringify(queryStringObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    // console.log("Before", this.queryString);
    // console.log("After", queryStringObject);
    // console.log(JSON.parse(queryStr));
    return this;
  }
  // 3)- Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log("sorted By", sortBy);
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  //4)- fields
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      console.log("fields is", fields);
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }
  //5)- search
  search(modelName) {
    if (this.queryString.keyword) {
      let mongooseQuerysearch = this.model;
      const searchQuery = {};
      if (modelName == "product") {
        searchQuery.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          {
            description: { $regex: this.queryString.keyword, $options: "i" },
          },
        ];
      } else {
        searchQuery.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }

      console.log("search keyword", searchQuery.$or);
      console.log("Final search query:", JSON.stringify(searchQuery, null, 2));
      this.mongooseQuery = mongooseQuerysearch.find(searchQuery);
    }
    return this;
  }

  // 2)- pagination
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endPageIndex = page * limit;

    //pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    if (endPageIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) {
      pagination.prevPage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }
}
module.exports = ApiErrorFeatures;
