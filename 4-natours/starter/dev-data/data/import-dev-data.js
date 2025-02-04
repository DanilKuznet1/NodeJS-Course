// Script that will import all of the dev data into the database

const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  `<PASSWORD>`,
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, { useUnifiedTopology: true }).then((connection) => {
  console.log('DB connection is established');
});

// READ JSON FILES
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.error(err.message);
  }
};

// DELETE DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany(); // if passed nothing, it will delete all of the documents in the collection
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.error(err.message);
  }
};

if (process.argv[2] === '--import') {
  // node dev-data/data/import-dev-data.js (--import/--delete)
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv)
