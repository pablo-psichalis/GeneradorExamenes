const jwt = require('jsonwebtoken');
const config = require('../config/config');
const createError = require('http-errors');

const hoursToExpire = 3; // 3

function createToken(user) {
  return jwt.sign({ id: user.id }, config.TOKEN_SECRET);
}

function protected(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) return next(createError(401, 'Login required'));
  jwt.verify(token, config.TOKEN_SECRET, function (err, decoded) {
    if (err) return next(createError(401, 'Unable to verify - Login required'));
    req.verified = true;
    req.token = decoded;
    // test4: 5b2251a5bd373dea1873310a
    // test3: 5b22513abd373dea18733108
    // test: 5b225102bd373dea18733104
    // test2: 5b225117bd373dea18733106
    // TODO: quitar
    next();
  });
}

module.exports = {
  createToken,
  protected
};