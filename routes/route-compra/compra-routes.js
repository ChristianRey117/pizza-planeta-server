const multer = require("multer");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/compraController");


const uploadImage = multer({
    storage: multer.memoryStorage(), //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});

routes.get('/', (req, res) => {
    conexion.query(
        "SELECT buy.id_buy, buy.ammount, " +
        "DATE_FORMAT(buy.date, '%d-%m-%y %H:%i:%s') AS date, " +
        "user.user_name AS user, " +
        "product.product_name AS product, " +
        "product.image AS image, " +
        "buy.id_status, " +
        "status.status_name AS status, " +
        "buy.status_item " +
        "FROM buy " +
        "JOIN user ON buy.id_user = user.id_users " +
        "JOIN product ON buy.id_product = product.id_product " + 
        "JOIN status ON buy.id_status = status.id_status " + 
        "WHERE buy.status_item = 'activo' ", 
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
        "product.image AS image, " +
        "product.product_price AS price, " +
        "buy.total_buy, " +
        "buy.id_status, " +
        "status.status_name AS status, " +
        "buy.status_item " +
        "FROM buy " +
        "JOIN user ON buy.id_user = user.id_users " +
        "JOIN product ON buy.id_product = product.id_product " +
        "JOIN status ON buy.id_status = status.id_status " +
        "WHERE user.id_user = ? AND buy.status_item = 'activo'",
        [id_user], (err, rows) => {
            if(err)
            {
               res.send({err:'error al obtener la consulta'});
               console.log(err)

            }
            var compras = [];
            var compra = {};
            rows.forEach(element => {
                const fecha = element.date;
                if(!compra[fecha] )
                {
                    compra[fecha] = true;
                    const elementFecha = rows.filter(objeto => objeto.date === fecha);
                    compras.push(elementFecha);
                }
            });


            var orderCompra = convertirCadenasAFechas(compras);
            orderCompra.sort((a,b)=> b[0].date - a[0].date);

            orderCompra = orderCompra.map(function (subArray) {
                return subArray.map(function (obj) {
                  obj.date = obj.date.toLocaleString();
                  return obj;
                });
              });
            res.json(orderCompra);
        }
    );
  });
//compras segun el Usuario

function convertirCadenasAFechas(array) {
    return array.map(function (subArray) {
      return subArray.map(function (obj) {
        const parts = obj.date.split(" ");
        const dateParts = parts[0].split("-");
        const timeParts = parts[1].split(":");
        const year = `20${dateParts[2]}`;
        const month = dateParts[1] - 1; // Restar 1 porque los meses en Date son de 0 a 11
        const day = dateParts[0];
        const hours = timeParts[0];
        const minutes = timeParts[1];
        const seconds = timeParts[2];
  
        obj.date = new Date(year, month, day, hours, minutes, seconds);
        return obj;
      });
    });
}



//COMPRAS DE TODOS LOS USUARIOS
routes.get('/usuarios', (req, res) => {
    conexion.query(
        "SELECT buy.id_buy, buy.ammount, " +
        "DATE_FORMAT(buy.date, '%d-%m-%y %H:%i:%s') AS date, " +
        "buy.id_user, " +
        "user.user_name AS user, " +
        "product.product_name AS product, " +
        "product.image AS image, " +
        "product.product_price AS price, " +
        "buy.total_buy, " +
        "buy.id_status, " +
        "status.status_name AS status, " +
        "buy.status_item " +
        "FROM buy " +
        "JOIN user ON buy.id_user = user.id_users " +
        "JOIN product ON buy.id_product = product.id_product " +
        "JOIN status ON buy.id_status = status.id_status " +
        "WHERE buy.status_item = 'activo'",
        (err, rows) => {
            if(err)
            {
               res.send({err:'error al obtener la consulta'});
               console.log(err)

            }
            var compras = [];
            var compra = {};
            rows.forEach(element => {
                const fecha = element.date;
                if(!compra[fecha] )
                {
                    compra[fecha] = true;
                    const elementFecha = rows.filter(objeto => objeto.date === fecha);
                    compras.push(elementFecha);
                }
            });


            var orderCompra = convertirCadenasAFechas(compras);
            orderCompra.sort((a,b)=> b[0].date - a[0].date);

            orderCompra = orderCompra.map(function (subArray) {
                return subArray.map(function (obj) {
                  obj.date = obj.date.toLocaleString();
                  return obj;
                });
              });
            res.json(orderCompra);
        }
    );
  });
//COMPRAS DE TODOS LOS USUARIOS



//GET DE ESTATUS
routes.get('/estatus', (req, res) => {
    conexion.query(
        "SELECT status.id_status, status.status_name " +
        "FROM status ",
        (err, rows) => {
            if(err)
            {
                res.send({err: "Error al hacer la consulta"});
            }
            res.json(rows);
        }
    );
});
//GET DE ESTATUS


routes.post("/add", uploadImage.none("image"), controller.createCompra);
routes.put("/delete", uploadImage.none("image") ,controller.deleteCompra);
routes.put("/update/:id_user", uploadImage.single("image"), controller.updateStatus);

module.exports = routes;