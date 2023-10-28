const multer = require("multer");
const path = require("path");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/authController");

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


routes.post('/login', uploadImage.none("image"), controller.login);


module.exports = routes;