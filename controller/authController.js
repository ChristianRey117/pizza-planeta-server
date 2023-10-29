const conexion = require("../database");
const jwt = require('jsonwebtoken'); //maneja los tokens
const bcrypt = require('bcryptjs'); //maneja el encriptado

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

    //obtiene el password de la BD
    const passwordBD = row[0].user_password;

    //compara el hash de la BD con la ingresada
    bcrypt.compare(data.user_password, passwordBD, (error, result) => {
      if(error)
      {
        res.send({error: 'No se pudo comparar el hash'});
      }

      if(result)
      {[]
        //creacion del TOKEN para front
        const userData = { id: row[0].id_users,};
        // Firma el token con una clave secreta y establece la vigencia
        const claveSecreta = 'pizzaPlaneta';
        const token = jwt.sign(userData, claveSecreta, { expiresIn: '1h' }); 

        const info = {
          mensaje: 'LOGIN EXITOSO',
          token: token,
          id_usuario: row[0].id_users,
          tipo_usuario: row[0].id_type_users,
        }

        // Envía el token como respuesta
        res.json({info});
      }
      else
      {
        res.send({err:'CONTRASEÑA INCORRECTA'});
      }

    });
  });
};





module.exports = { login };