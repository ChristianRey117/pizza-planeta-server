const multer = require("multer");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/usuarioController");
  
const uploadImage = multer({
    storage: multer.memoryStorage(), //configuracion de la carpeta donde se guardaran los archivos subidos por el usuario
});


routes.get('/', (req, res) => {
  conexion.query(
    "SELECT user.id_users, user.user_name, user.user_email, user.user_password, user.phone, user.direction, " +
    "type_user.type_users_name AS typeU, " + 
    "neighborhood.neighborhood_name AS neighborhood, " +
    "branch.branch_name AS branch " +
    "FROM user "  +
    "LEFT JOIN type_user ON user.id_type_users = type_user.id_type_users " +
    "LEFT JOIN neighborhood ON user.id_neighborhood = neighborhood.id_neighborhood " +
    "LEFT JOIN branch ON user.id_branch = branch.id_branch",
    (err, rows) => {
      if(err) {
        res.send({err: "Error al hacer la consulta"});
      }
      res.json(rows);
    }
  );
});


routes.get('/:id_users', (req, res) => {
  var idUser = req.params.id_users;
  conexion.query(
    "SELECT user.id_users, user.user_name, user.user_email, user.user_password, user.phone, user.direction, " +
    "user.id_type_users, " +
    "type_user.type_users_name AS typeU, " + 
    "user.id_neighborhood, " +
    "neighborhood.neighborhood_name AS neighborhood, " +
    "user.id_branch, " +
    "branch.branch_name AS branch " +
    "FROM user "  +
    "LEFT JOIN type_user ON user.id_type_users = type_user.id_type_users " +
    "LEFT JOIN neighborhood ON user.id_neighborhood = neighborhood.id_neighborhood " +
    "LEFT JOIN branch ON user.id_branch = branch.id_branch " +
    "WHERE user.id_users = ?",
    [idUser], (err, rows) => {
      if(err) {
        res.send({err: "Error al hacer la consulta"});
      }
      res.json(rows);
    }
  );
});


routes.post("/add", uploadImage.none("image"), controller.createUsuario);
routes.put("/update/:id_users", uploadImage.none("image"), controller.updateUsuario);
routes.delete("/delete/:id_users", uploadImage.none("image"), controller.deleteUsuario);




//obtener colonias segun la sucursal
routes.get('/branch/:id_branch', (req, res) => {
  var id_branch = req.params.id_branch;

  conexion.query(
    "SELECT id_neighborhood, neighborhood_name " + 
    "FROM neighborhood " +
    "WHERE id_branch = ?",
    [id_branch], (err, rows) => {
      if(err)
      {
        res.send({err:'error al obtener las colonias'});
        //console.log(err);
      }
      res.json(rows);
    }
  );
});
//obtener colonias segun la sucursal


module.exports = routes;
