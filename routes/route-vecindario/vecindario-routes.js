const multer = require("multer");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/vecindarioController");



const uploadImage = multer({
    storage: multer.memoryStorage(), //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});

routes.get('/', (req, res) => {
    conexion.query(
        "SELECT neighborhood.id_neighborhood, neighborhood_name, " +
        "branch.branch_name AS branch " +
        "FROM neighborhood " + 
        "JOIN branch ON neighborhood.id_branch = branch.id_branch",
        (err, rows) => {
            if(err)
            {
                res.send({err:"Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

routes.get('/:id_neighborhood', (req, res) => {
    var id = req.params.id_neighborhood;
    conexion.query(
        "SELECT neighborhood.id_neighborhood, neighborhood_name, neighborhood.id_branch, " +
        "branch.branch_name AS branch " +
        "FROM neighborhood " + 
        "JOIN branch ON neighborhood.id_branch = branch.id_branch " +
        "WHERE neighborhood.id_neighborhood = ?",
        [id],(err, rows) => {
            if(err)
            {
                res.send({err:"Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

routes.post("/add", uploadImage.none("image"),controller.createVecindario);
routes.delete("/delete/:id_neighborhood", controller.deleteVecindario);
routes.put("/update/:id_neighborhood", uploadImage.none("image"),controller.updateVecindario);



module.exports = routes;