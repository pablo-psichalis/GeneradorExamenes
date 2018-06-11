const usersModel = require('../models/users.model');

function auth(user) {
  return usersModel.auth(user);
}

module.exports = {
  auth,
};
