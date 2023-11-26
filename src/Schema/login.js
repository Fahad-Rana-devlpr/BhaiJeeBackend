const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
    // Define your schema fields based on CSV columns
    username: String,
    password: String,
  });
  const login = mongoose.model('login', loginSchema);

module.exports = login;  