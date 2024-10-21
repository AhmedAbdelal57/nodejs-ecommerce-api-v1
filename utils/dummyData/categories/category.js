const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const CategoryModel = require('../../../models/categoryModel');
const dbConnection = require('../../../config/database');

dotenv.config({ path: '../../../config.env' });

// connect to DB
dbConnection();

// Read data
const Categories = JSON.parse(fs.readFileSync('./categories.json'));


// Insert data into DB
const insertData = async () => {
  try {
    await CategoryModel.create(Categories);

    console.log('Categories Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await CategoryModel.deleteMany();
    console.log('Categories Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}