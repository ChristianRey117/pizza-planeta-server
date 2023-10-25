const multer = require("multer");
const path = require("path");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/ofertaController");

const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
      cb(
        null,      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
});

const uploadImage = multer({
    storage: storage, //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});


routes.get('/', (req, res) => {
    conexion.query(
        "SELECT ofert.id_ofert, ofert.name_ofert, ofert.discount, ofert.description, ofert.image " +
        "FROM ofert ",
        (err, rows) => {
            if(err)
            {
                res.send({err: "Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

routes.get('/:id_ofert', (req, res) => {
    var idOfert = req.params.id_ofert;
    conexion.query(
        "SELECT ofert.id_ofert, ofert.name_ofert, ofert.discount, ofert.description, ofert.image " +
        "FROM ofert " +
        "WHERE ofert.id_ofert = ?",
        [idOfert],(err, rows) => {
            if(err)
            {
                res.send({err: "Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

routes.post("/add", uploadImage.single("image"), controller.createOferta);
routes.delete("/delete/:id_ofert", controller.deleteOferta);
routes.put("/update/:id_ofert", uploadImage.single("image"), controller.updateOferta);


module.exports = routes;