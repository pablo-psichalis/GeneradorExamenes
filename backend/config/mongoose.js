const config = require('./config');
const mongoose = require('mongoose');

/* console.log('Connecting to Mongo: ', config.DB_URI); */

// Connect to MongoCloud Database
mongoose.connect(config.DB_URI);
