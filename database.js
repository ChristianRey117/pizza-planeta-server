const mysql = require("mysql");

// Configuración de la conexión a la base de datos
const conexion = mysql.createConnection({
    host:'localhost',
    database:'pizza planeta',
    user:'root',
    password:'',
});


// Conectar a la base de datos
conexion.connect(function(error){
    if(error)
    {
        throw error;
    }
    else
    {
        console.log('CONEXION EXITOSA');
    }
});


module.exports = conexion;
