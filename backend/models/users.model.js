const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

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

function getUser(userId) {
  return User.findOne({ _id: new ObjectId(userId) }, { password: 0 });
}

module.exports = {
  create,
  auth,
  getUser,
};

