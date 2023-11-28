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
        "SELECT inventory.id_inventory, inventory.ammountQueso, inventory.ammountSalsa, inventory.ammountHarina, " +
        "inventory.ammountChampi, inventory.ammountPina, inventory.ammountChiles, " + 
        "branch.branch_name AS branch, " +
        "inventory.status_item " +
        "FROM inventory " +
        "JOIN branch ON inventory.id_branch = branch.id_branch " +
        "WHERE inventory.status_item = 'activo' ", 
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
        "SELECT inventory.id_inventory, inventory.ammountQueso, inventory.ammountSalsa, inventory.ammountHarina, " + 
        "inventory.ammountChampi, inventory.ammountPina, inventory.ammountChiles, " + 
        "branch.branch_name AS branch, inventory.id_branch, " +
        "inventory.status_item " +
        "FROM inventory " +
        "JOIN branch ON inventory.id_branch = branch.id_branch " +
        "WHERE inventory.id_inventory = ? AND inventory.status_item = 'activo' ",
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
routes.put("/delete/:id_inventory", controller.deleteInvetario);



module.exports = routes;