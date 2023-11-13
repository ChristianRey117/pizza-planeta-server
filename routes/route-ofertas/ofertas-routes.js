const multer = require("multer");
const path = require("path");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/ofertaController");

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(
        null,      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
});

const uploadImage = multer({
    storage: multer.memoryStorage(), //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});

const log = require("../../log");





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
routes.get("/logs", (req, res)=>{
    log.logger.query({ order: 'desc', limit: 100 }, 
    (err, results) => { 
        if (err) { 

            // If an error occurs, send an 
            // error response 
            res.status(500).send({  
                error: 'Error retrieving logs' 
            }); 
        } else { 

            // If successful, send the log  
            // entries as a response 
            res.send(results); 
        } 
    }); 

})


module.exports = routes;