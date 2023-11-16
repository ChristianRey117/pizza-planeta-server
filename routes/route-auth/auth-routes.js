const multer = require("multer");

const express = require("express");
const routes = express.Router();
const conexion = require("../../database");
const controller = require("../../controller/authController");



const uploadImage = multer({
  storage: multer.memoryStorage()
});


routes.post('/login', uploadImage.none("image"), controller.login);


module.exports = routes;