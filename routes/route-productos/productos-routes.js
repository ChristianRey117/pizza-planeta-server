const multer = require("multer");
const path = require("path");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/productoController");



const uploadImage = multer({
    // storage: storage, //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
    storage: multer.memoryStorage(), //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});


routes.get('/', (req, res) => {
    conexion.query(
        "SELECT product.id_product, product.product_name, product.product_price, product.image, product.id_ofert, " +
        "ofert.name_ofert AS ofert, ofert.discount, product.id_type_category, " +
        "type_category.name_category AS category, " +
        "product.status_item " +
        "FROM product " +
        "JOIN ofert ON product.id_ofert = ofert.id_ofert " +
        "JOIN type_category ON product.id_type_category = type_category.id_category " +
        "WHERE product.status_item = 'activo' ", 
        (err, rows) => {
            if(err)
            {
                //res.send({err: "Error al hacer la consulta"});
                console.log(err);
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
        "type_category.name_category AS category, " +
        "product.status_item " +
        "FROM product " +
        "JOIN ofert ON product.id_ofert = ofert.id_ofert " +
        "JOIN type_category ON product.id_type_category = type_category.id_category " +
        "WHERE product.id_product = ? AND product.status_item = 'activo'",
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
routes.put("/delete/:id_product", controller.deleteProducto);
routes.put("/update/:id_product", uploadImage.single("image"), controller.updateProducto);



module.exports = routes;