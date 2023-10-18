const multer = require("multer");
const path = require("path");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/proveedorController");

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
    "SELECT supplier.id_supplier, supplier.supplier_name, supplier.supplier_product, supplier.image" +
    " FROM supplier", 
    (err, rows) => {
      if(err)
      {
        res.send({err: 'Error al conectar con la base de datos'});
      }
      res.json(rows);
    }
  );
});

routes.get('/:id_supplier', (req, res) =>{
  var idSupplier = req.params.id_supplier;
  conexion.query(
    "SELECT supplier.id_supplier, supplier.supplier_name, supplier.supplier_product, supplier.image" +
    " FROM supplier" +
    " WHERE supplier.id_supplier = ?", 
    [idSupplier], (err, rows) => {
      if(err) 
      {
        res.send({ err: "No se encontro el registro" });
      }
      res.json(rows); 
    }
  );
});

routes.post("/add", uploadImage.single("image"), controller.createProveedor);
routes.delete("/delete/:id_supplier", controller.deleteProveedor);
routes.put("/update/:id_supplier", uploadImage.single("image"), controller.updateProveedor);


module.exports = routes;
