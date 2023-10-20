const conexion = require("../database");

const createTipoUsuario = async (req, res) => {
    var data = {
        type_users_name : req.body.type_users_name,
    };
    
    conexion.query("INSERT INTO type_user SET ?", [data], (err) => {
    if (err) 
    {
        res.send({ err: "Error al conectar con la base de datos" });
    }
        res.send("Registro exitoso");
    });
};

const updateTipoUsuario = (req, res) => {
    var id_type_users = req.params.id_type_users;
    var data = {
        type_users_name : req.body.type_users_name,
    };
    
    conexion.query("UPDATE type_user SET ? WHERE id_type_users = ?", [data, id_type_users], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Actualizacion exitosa");
    });
}

const deleteTipoUsuario = async (req, res) => {
    var id_type_users = req.params.id_type_users;
    conexion.query("DELETE FROM type_user WHERE id_type_users = ?", [id_type_users], (err) => {
        if (err) {
            res.send({err:'Error al eliminar el registro:'},);
        } else {
            res.send('Registro eliminado exitosamente');
        }
    });
};


module.exports = {createTipoUsuario, updateTipoUsuario, deleteTipoUsuario};