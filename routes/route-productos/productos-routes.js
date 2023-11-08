const multer = require("multer");
const path = require("path");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/productoController");

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
        "SELECT product.id_product, product.product_name, product.product_price, product.image, product.id_ofert, " +
        "ofert.name_ofert AS ofert, ofert.discount, product.id_type_category, " +
        "type_category.name_category AS category " +
        "FROM product " +
        "JOIN ofert ON product.id_ofert = ofert.id_ofert " +
        "JOIN type_category ON product.id_type_category = type_category.id_category",
        (err, rows) => {
            if(err)
            {
                res.send({err: "Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

routes.get('/:id_product', (req, res) => {
    var idProduct = req.params.id_product;
    conexion.query(
        "SELECT product.id_product, product.product_name, product.product_price, product.image, product.id_ofert, " +
        "ofert.name_ofert AS ofert, ofert.discount, product.id_type_category, " +
        "type_category.name_category AS category " +
        "FROM product " +
        "JOIN ofert ON product.id_ofert = ofert.id_ofert " +
        "JOIN type_category ON product.id_type_category = type_category.id_category " +
        "WHERE product.id_product = ?",
        [idProduct], (err, rows) => {
            if(err)
            {
                res.send({err: "No se encontro el registro"});
            }
            res.json(rows);
        }
    );
});

routes.post("/add", uploadImage.single("image"), controller.createProducto);
routes.delete("/delete/:id_product", controller.deleteProducto);
routes.put("/update/:id_product", uploadImage.single("image"), controller.updateProducto);



module.exports = routes;