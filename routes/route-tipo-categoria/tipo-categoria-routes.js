const multer = require("multer");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/tipocategoriaController");


const uploadImage = multer({
    storage: multer.memoryStorage(), //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});


routes.get('/', (req, res) => {
    conexion.query(
        "SELECT type_category.id_category, type_category.name_category, type_category.description,  " +
        "type_category.status_item " +
        "FROM type_category " +
        "WHERE type_category.status_item = 'activo' ", 
        (err, rows) => {
            if(err)
            {
                res.send({err:"Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

routes.get('/:id_category', (req, res) => {
    var id = req.params.id_category;
    conexion.query(
        "SELECT type_category.id_category, type_category.name_category, type_category.description, " +
        "type_category.status_item " +
        "FROM type_category " +
        "WHERE type_category.id_category = ? AND type_category.status_item = 'activo'", 
        [id], (err, rows) => {
            if(err)
            {
                res.send({err:"Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

routes.post("/add", uploadImage.none("image"),controller.createTipoCategoria);
routes.put("/delete/:id_category",controller.deleteTipoCategoria);
routes.put("/update/:id_category", uploadImage.none("image"),controller.updateTipoCategoria);

module.exports = routes;