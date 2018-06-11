const express = require('express');
const createError = require('http-errors');

const router = express.Router();

/* GET users listing. */
router.route('/').post(express.json(), (req, res, next) => {
  const user = req.body;
  if (!user.nombre) return next(createError(400, 'Nombre obligatorio.'));
  if (!user.correo) return next(createError(400, 'Correo obligatorio.'));
  if (!user.password) return next(createError(400, 'Password obligatoria.'));
  usersController.create(user)
    .then((response) => {
      res.json(response);
      res.status = 201;
    }).catch((err) => {
      if (err.code === 11000) { return next(createError(409, 'Correo ya registrado')); }
      return next();
    });
});

module.exports = router;
