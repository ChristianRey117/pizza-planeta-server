const conexion = require("../database");
const moment = require('moment-timezone');

const createCompra = async (req, res) => {
    //inserta fecha actual
   const currentDateTime = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');  //formato 24
   //const currentDateTime = moment().tz('America/Mexico_City').format('YYYY-MM-DD hh:mm:ss A');  /formato 12

    var data = {
        id_user : req.body.id_user ,
        id_product : req.body.id_product ,
        date: currentDateTime,
        ammount: req.body.ammount,
    };
  
    conexion.query("INSERT INTO buy SET ?", [data], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Registro exitoso");
    });
};


const deleteCompra = async (req, res) => {
    var id_buy = req.params.id_buy;
    conexion.query("DELETE FROM buy WHERE id_buy = ?", [id_buy], (err) => {
        if (err) {
            res.send({err:'Error al eliminar el registro:'},);
        } else {
            res.send('Registro eliminado exitosamente');
        }
    });
};

module.exports = {createCompra, deleteCompra};