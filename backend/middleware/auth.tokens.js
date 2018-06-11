const jwt = require('jsonwebtoken');
const config = require('./config');
const createError = require('http-errors');

const hoursToExpire = 3; // 3

function createToken(user) {
  return jwt.sign({ id: user._id }, config.TOKEN_SECRET, { expiresIn: 30 /* 60 * 60 * hoursToExpire */ });
}

function protected(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) return next(createError(401, 'Login necesario'));
  jwt.verify(token, config.TOKEN_SECRET, function (err, decoded) {
    if (err) return next(createError(401, 'Login necesario'));
    req.verified = true;
    req.token = decoded;
    next();
  });
}

module.exports = {
  createToken,
  protected
};