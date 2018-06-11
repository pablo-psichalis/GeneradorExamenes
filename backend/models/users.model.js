const mongoose = require('mongoose');

const User = mongoose.model('user', {
  nombre: String,
  correo: String,
  password: String,
  resumen: String,
  foto: String,
  fechaNacimiento: Date,
});

function create(user) {
  return User(user).save();
}

function auth(user) {
  const queryAux = {};
  queryAux.correo = user.correo;
  queryAux.password = user.password;
  return User.findOne(queryAux);
}

module.exports = {
  create,
  auth,
};

