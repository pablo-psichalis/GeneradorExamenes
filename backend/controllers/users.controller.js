const usersModel = require('../models/users.model');

function create(user) {
  return usersModel.create(user);
}

function getUser(userId) {
  return usersModel.getUser(userId);
}
module.exports = {
  create,
  getUser,
};
