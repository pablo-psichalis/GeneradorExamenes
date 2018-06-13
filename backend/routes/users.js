const express = require('express');
const createError = require('http-errors');
const tokensMw = require('../middleware/auth.tokens');

const usersController = require('../controllers/users.controller');

const router = express.Router();

/* GET users listing. */
router.get('/', tokensMw.protected, (req, res, next) => {
  // datos del usuario actual
  // coger del token
  const userId = req.token.id;
  return usersController.getUser(userId)
    .then(response => res.json(response)).catch(next);
});

router.route('/register').post((req, res, next) => {
  const user = req.body;
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

router.get('/:id', (req, res, next) => {
  const userId = req.params.id;
  usersController.getUser(userId).then((response) => {
    res.json(response);
    res.status = 201;
  }).catch((err) => {
    if (err === -1) {
      next(createError(404, 'User not found'));
    }
    next();
  });
});

module.exports = router;
