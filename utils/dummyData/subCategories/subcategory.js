const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const subCategoryModel = require('../../../models/subCategoryModel');
const dbConnection = require('../../../config/database');

dotenv.config({ path: '../../../config.env' });

// connect to DB
dbConnection();

// Read data
const subCategories = JSON.parse(fs.readFileSync('./subcategory.json'));


// Insert data into DB
const insertData = async () => {
  try {
    await subCategoryModel.create(subCategories);

    console.log('subCategories Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await subCategoryModel.deleteMany();
    console.log('subCategories Destroyed'.red.inverse);
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