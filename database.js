const mysql = require("mysql");

// Configuración de la conexión a la base de datos

/*
const conexion = mysql.createConnection({
  host: "database-laravel.mysql.database.azure.com",
  database: "pizza_planeta",
  user: "christian",
  password: "GATOvaca1",
});
*/


const conexion = mysql.createConnection({
  host: "localhost",
  database: "pizza_planeta",
  user: "root",
  password: "",
});


// Conectar a la base de datos
conexion.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("CONEXION EXITOSA");
  }
});

module.exports = conexion;
