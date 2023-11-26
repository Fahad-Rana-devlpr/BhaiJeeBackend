const mongoose = require('mongoose');
require('dotenv').config();
const dbconn = process.env.DATABASE
console.log('he',dbconn)

// Connection URI for your MongoDB database
const uri = dbconn ; // Replace with your MongoDB URI
// const uri =  `${dbConfig.username}:${dbConfig.password}${apiKey}/${dbConfig.dbname}`; // Replace with your MongoDB URI

// Connect to MongoDB
mongoose.connect(uri);

// Get the default connection
const db = mongoose.connection;

// Event listeners for connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('DB is connected.')
  // You can start performing operations here
});
