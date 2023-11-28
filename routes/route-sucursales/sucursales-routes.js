const multer = require("multer");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");

const uploadImage = multer({
  storage: multer.memoryStorage(), //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});

const controller = require("../../controller/customController");


routes.get("/", (req, res) => {
  conexion.query(
    "SELECT branch.id_branch, branch.branch_name, branch.branch_direction, branch.work_personnel, branch.image, " + 
    "GROUP_CONCAT(supplier.id_supplier SEPARATOR ', ') AS ids_suppliers, " +
    "GROUP_CONCAT(supplier.supplier_name SEPARATOR ', ') AS suppliers, " +
    "supplier.status_item " +
    "FROM branch " +
    "LEFT JOIN supplier_branch ON branch.id_branch = supplier_branch.id_branch " +
    "LEFT JOIN supplier ON supplier_branch.id_supplier = supplier.id_supplier " + 
    "WHERE supplier.status_item = 'activo'  " +
    "GROUP BY branch.id_branch ",
    (err, rows) => {
      if (err) {
        console.log(err);
        res.send({ err: "Error al conectar con la base de datos" });
      }
      res.json(rows);
    }
  );
});


routes.get("/:id_branch", (req, res) =>{
  var id = req.params.id_branch;
  conexion.query(
    "SELECT branch.id_branch, branch.branch_name, branch.branch_direction, branch.work_personnel, branch.image, " + 
    "GROUP_CONCAT(supplier.id_supplier SEPARATOR ', ') AS ids_suppliers, " +
    "GROUP_CONCAT(supplier.supplier_name SEPARATOR ', ') AS suppliers, " +
    "status_item " +
    "FROM branch " +
    "LEFT JOIN supplier_branch ON branch.id_branch = supplier_branch.id_branch " +
    "LEFT JOIN supplier ON supplier_branch.id_supplier = supplier.id_supplier " + 
    "WHERE branch.id_branch = ? AND status_item = 'activo' " +
    "GROUP BY branch.id_branch ", 
    [id], (err, rows) => {
      if(err) {
        res.send({err: "No se encontro el registro"});
      }
      res.json(rows);      
    }
  );
})

routes.post("/add", uploadImage.single("image"), controller.createSucursal);

routes.put("/delete/:id_branch", controller.deleteSucursal);

routes.put("/update/:id_branch", uploadImage.single("image"), controller.updateSucursal);


module.exports = routes;
