const mongoose = require('mongoose')

const CsvDataSchema = new mongoose.Schema({
    // Define your schema fields based on CSV columns
    reqtxt: String,
    reqbtw: String,
    reqNo: String,
    brnd: String,
    dpd: String,
    bank: String
    // Add more fields as needed
  });
  const CsvData = mongoose.model('CsvData', CsvDataSchema);

module.exports = CsvData;  