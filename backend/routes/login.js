const express = require('express');
const createError = require('http-errors');
const loginController = require('../controllers/login.controller');
const tokenAuth = require('../middleware/auth.tokens');

const router = express.Router();

router.route('/').post((req, res, next) => {
  const user = req.body;
  if (!user.username) return next(createError(400, 'Username required.'));
  if (!user.password) return next(createError(400, 'Password required.'));

  loginController.auth(user)
    .then((response) => {
      if (response.length <= 0) return next(createError(401, 'Invalid credentials.'));
      const token = tokenAuth.createToken(response);
      const fullResponse = {};
      fullResponse.token = token;
      fullResponse.user = response;
      res.json(fullResponse);
      res.status = 201;
    })
    .catch(() => {
      next(createError(401, 'Invalid credentials.'));
    });
});

router.route('/validToken', tokenAuth.protected).get((req, res) => {
  res.send('Authenticated');
});

module.exports = router;
