const mongoose = require('mongoose');

const User = mongoose.model('users', {
  username: String,
  email: String,
  password: String,
  picture: String,
  birthDate: Date,
});

function create(user) {
  return User(user).save();
}

function auth(user) {
  const queryObj = {};
  queryObj.username = user.username;
  queryObj.password = user.password;
  return User.findOne(queryObj);
}

module.exports = {
  create,
  auth,
};

