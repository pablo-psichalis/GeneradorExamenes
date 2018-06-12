const express = require('express');
const createError = require('http-errors');

const usersController = require('../controllers/users.controller');

const router = express.Router();

/* GET users listing. */
router.route('/register').post((req, res, next) => {
  const { user } = req.body;
  if (!user.username) return next(createError(400, 'Username required.'));
  if (!user.password) return next(createError(400, 'Password required.'));
  // if (!user.email) return next(createError(400, 'Email obligatorio.'));
  usersController.create(user)
    .then((response) => {
      res.json(response);
      res.status = 201;
    }).catch((err) => {
      if (err.code === 11000) { return next(createError(409, 'Email already registered')); }
      return next();
    });
});

module.exports = router;
