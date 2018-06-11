const usersModel = require('../models/users.model');

function create(user) {
  return usersModel.create(user);
}

module.exports = {
  create,
};
