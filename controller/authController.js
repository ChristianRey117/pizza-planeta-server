const conexion = require("../database");
const jwt = require('jsonwebtoken'); //maneja los tokens

const login = (req, res) => {
  var email = req.body.user_email;
  var data = {
    user_email: req.body.user_email,
    user_password: req.body.user_password,
  }
  
  ///verfica si existe un el correo proporcionado
  conexion.query("SELECT * FROM user WHERE user_email = ?", [email], (err, row) => {
    if (err) {
      return res.send({ err: 'Error en la base de datos' });
    }

    if (row.length === 0) {
      return res.send({ err: 'CORREO INCORRECTO' });
    }

    ///verfica si las contrasenias coinciden
    const passwordBD = row[0].user_password;

    if(data.user_password === passwordBD)
    {
      //creacion el TOKEN para front
      const userData = { id: row[0].id_users,};
      // Firma el token con una clave secreta y establece la vigencia
      const claveSecreta = 'pizzaPlaneta';
      const token = jwt.sign(userData, claveSecreta, { expiresIn: '1h' }); 

      const info = {
        mensaje: 'LOGIN EXITOSO',
        token: token,
        tipo_usuario: row[0].id_type_users,
      }

      // Envía el token como respuesta
      res.json({info});
    }
    else{
      res.send({err:'CONTRASEÑA INCORRECTA'});
    }
  });
};





module.exports = { login };