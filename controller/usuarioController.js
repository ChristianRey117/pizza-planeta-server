const conexion = require("../database");


const createUsuario = async(req, res) => {
    var data = {
        user_name: req.body.user_name,
        phone: req.body.phone,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
        direction: req.body.direction,
        id_type_users: req.body.id_type_users || null,
        id_branch: req.body.id_branch || null,
        id_neighborhood: req.body.id_neighborhood || null,
    };

    conexion.query("SELECT * FROM user WHERE user_email = ?", [data.user_email], (err, row) => {
        if(row.length > 0)
        {
            res.send({err:'Ya existe una cuenta con ese correo'});
        }
        else
        {
            conexion.query("INSERT INTO user SET ?", [data], (err) => {
                if (err) 
                {
                   res.send({ err: "Error al conectar con la base de datos" }); 
                }
                    res.send("Registro exitoso");
            });
        }
    });
}


const updateUsuario = (req, res) => {
    var idUser = req.params.id_users;
    var data = {
        user_name: req.body.user_name,
        phone: req.body.phone,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
        direction: req.body.direction,
        id_type_users: req.body.id_type_users || null,
        id_branch: req.body.id_branch || null,
        id_neighborhood: req.body.id_neighborhood || null,
      };
    
    conexion.query("UPDATE user SET ? WHERE id_users = ?", [data, idUser], (err) => {
        if (err) 
        {
        res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Actualizacion exitosa");
    });
}


const deleteUsuario = async (req, res) => {
    var idUser = req.params.id_users;
    conexion.query("DELETE FROM user WHERE id_users = ?", [idUser], (err) => {
        if (err) {
            res.send({err:'Error al eliminar el registro:'},);
        } else {
            res.send('Registro eliminado exitosamente');
        }
    });
};


module.exports = {createUsuario, updateUsuario, deleteUsuario};