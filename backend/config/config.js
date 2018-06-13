require('dotenv').config({ path: './.env' });

module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  DB_URI: `mongodb+srv://${process.env.MONGO_ATLAS_USER}:mongolia@cluster-ono9y.mongodb.net/Test`,
};
