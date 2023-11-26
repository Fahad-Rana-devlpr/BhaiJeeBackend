const mongoose = require('mongoose')

const loginDetailsSchema = new mongoose.Schema({
    // Define your schema fields based on CSV columns
    username: String,
    token: String,
  });
  const loginDetails = mongoose.model('logindetails', loginDetailsSchema);

module.exports = loginDetails;  