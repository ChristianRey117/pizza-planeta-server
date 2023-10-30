const multer = require("multer");
const path = require("path");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/compraController");

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
        "SELECT buy.id_buy, buy.ammount, " +
        "DATE_FORMAT(buy.date, '%d-%m-%y %H:%i:%s') AS date, " +
        "user.user_name AS user, " +
        "product.product_name AS product, " +
        "product.image AS image " +
        "FROM buy " +
        "JOIN user ON buy.id_user = user.id_users " +
        "JOIN product ON buy.id_product = product.id_product ", 
        (err, rows) => {
            if(err)
            {
                res.send({err: "Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});

//compras segun el Usuario
routes.get('/usuario/:id_user', (req, res) => {
    var id_user = req.params.id_user;
  
    conexion.query(
        "SELECT buy.id_buy, buy.ammount, " +
        "DATE_FORMAT(buy.date, '%d-%m-%y %H:%i:%s') AS date, " +
        "user.user_name AS user, " +
        "product.product_name AS product, " +
        "product.image AS image " +
        "FROM buy " +
        "JOIN user ON buy.id_user = user.id_users " +
        "JOIN product ON buy.id_product = product.id_product " +
        "WHERE id_user = ?",
        [id_user], (err, rows) => {
            if(err)
            {
                res.send({err:'error al obtener las colonias'});
            }
            res.json(rows);
        }
    );
  });
//compras segun el Usuario
  

routes.post("/add", uploadImage.none("image"), controller.createCompra);
routes.delete("/delete/:id_buy", controller.deleteCompra);

module.exports = routes;