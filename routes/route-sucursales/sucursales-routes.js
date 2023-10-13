const multer = require("multer");
const path = require("path");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadImage = multer({
  storage: storage, //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});

const controller = require("../../controller/customController");

routes.get("/", (req, res) => {
  conexion.query(
    "SELECT branch.id_branch, branch.branch_name, branch.branch_direction, branch.work_personnel,branch.image, supplier.supplier_name AS supplier" +
      " FROM branch" +
      " JOIN supplier ON branch.id_supplier = supplier.id_supplier",
    (err, rows) => {
      if (err) {
        throw err;
      }
      res.json(rows);
    }
  );
});

routes.post("/add", uploadImage.single("image"), controller.createSucursal);

module.exports = routes;
