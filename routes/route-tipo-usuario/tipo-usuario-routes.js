const multer = require("multer");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/tipousuarioController");


const uploadImage = multer({
    storage: multer.memoryStorage(), //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});


routes.get('/', (req, res) => {
    conexion.query(
        "SELECT type_user.id_type_users, type_user.type_users_name " +
        "FROM type_user ",
        (err, rows) => {
            if(err)
            {
                res.send({err:"Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

routes.get('/:id_type_users', (req, res) => {
    var idTipoU = req.params.id_type_users;
    conexion.query(
        "SELECT type_user.id_type_users, type_user.type_users_name " +
        "FROM type_user " +
        "WHERE type_user.id_type_users = ?",
        [idTipoU], (err, rows) => {
            if(err)
            {
                res.send({err:"Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

routes.post("/add", uploadImage.none("image"),controller.createTipoUsuario);
routes.put("/update/:id_type_users", uploadImage.none("image"),controller.updateTipoUsuario);
routes.delete("/delete/:id_type_users", uploadImage.none("image"),controller.deleteTipoUsuario);

module.exports = routes;