const multer = require("multer");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/inventarioController");


const uploadImage = multer({
    storage: multer.memoryStorage(), //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});

routes.get('/', (req, res) => {
    conexion.query(
        "SELECT inventory.id_inventory, inventory.ammountQueso, inventory.ammountSalsa, inventory.ammountHarina, inventory.ammountChampi, inventory.ammountPina, inventory.ammountChiles, " + 
        "branch.branch_name AS branch " +
        "FROM inventory " +
        "JOIN branch ON inventory.id_branch = branch.id_branch",
        (err, rows) => {
            if(err)
            {
                res.send({err:"Error con la consulta"});
            }
            res.json(rows);
        }  
    );
});

routes.get('/:id_inventory', (req, res) => {
    var idInventory = req.params.id_inventory;
    conexion.query(
        "SELECT inventory.id_inventory, inventory.ammountQueso, inventory.ammountSalsa, inventory.ammountHarina, inventory.ammountChampi, inventory.ammountPina, inventory.ammountChiles, " + 
        "branch.branch_name AS branch, inventory.id_branch " +
        "FROM inventory " +
        "JOIN branch ON inventory.id_branch = branch.id_branch " +
        "WHERE inventory.id_inventory = ?",
        [idInventory], (err, rows) => {
            if(err)
            {
                res.send({err: "No se encontro el registro"});
            }
                res.json(rows);
        }
    );
});

routes.post("/add", uploadImage.none("image"),controller.createInventario);
routes.put("/update/:id_inventory", uploadImage.none("image"),controller.updateInvetario);
routes.delete("/delete/:id_inventory", controller.deleteInvetario);



module.exports = routes;