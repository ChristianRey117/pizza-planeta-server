const conexion = require("../database");
const moment = require('moment-timezone');
const emailController = require('./emailController.js');

const createCompra = async (req, res) => {
    //inserta fecha actual
   const currentDateTime = moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');  //formato 24
   //const currentDateTime = moment().tz('America/Mexico_City').format('YYYY-MM-DD hh:mm:ss A');  /formato 12

   const products = req.body.products;
   console.log(req.body);


    products.forEach((element, index) => {
        var data = {
            id_user : req.body.id_user ,
            id_product : element.id_product ,
            date: currentDateTime,
            ammount: element.quantity,
            id_status: element.id_status || 1,
            status_item: element.status_item || 'activo',
        };
        data = {...data, total_buy: element.product_price };

        console.log(data);

        conexion.query("INSERT INTO buy SET ?", [data], (err, result) => {
            if (err) 
            {
                res.send({ err: "Error al conectar con la base de datos" });
            }

            if(products.length -1 === index){
                var compra = {
                    mensaje:'Registro exitoso',
                    id_buy:result.insertId,
                };
                
                res.send(compra);
                var usuario = req.body.id_user 
                correo(usuario);
            }
        });
   });     
};


const correo = async (idUser) =>
{
    console.log('usuario:' , idUser);
    //Correo de compra
    conexion.query(
        "SELECT user.user_email AS email " +
        "FROM buy " +
        "JOIN user ON buy.id_user = user.id_users " +
        "WHERE id_user = ? ",
        [idUser], (err, rows) => {
            if(err)
            {
                res.send({err:'error al obtener la consulta'});
            }
            else
            {
                const email = rows[0].email;
                console.log('Correo de compra:', email);
                emailController.sendCompraEmail(email);
            }
        }
    );
};


const deleteCompra = async (req, res) => {
    var ids_buy = JSON.parse(req.body.data);
    console.log('id compra--->' ,req.body);
    ids_buy.forEach((id, index)=>{
        conexion.query("UPDATE buy SET status_item = 'inactivo' WHERE id_buy = ?", [id], (err) => {
           if(index == ids_buy.length -1){
            if (err) {
                res.send({err:'Error al actualizar Estatus de Item'});
            } else {
                res.send('Estatus de Item actualizado exitosamente');
            }
           }
        });
    })

    
};


const updateStatus = async (req, res) => {
    const  id_User = req.params.id_user;
    const ids_compras = JSON.parse(req.body.ids_compras);
    
    const data = {
        id_status: req.body.status_compra,
    };
    console.log('id_user-->', id_User)

    console.log('data-->', data)

    ids_compras.forEach((id_compra, index)=>{
    
        conexion.query("UPDATE buy SET ? WHERE id_user = ? AND id_buy = ? AND id_status = 1 OR id_status = 2", [data, id_User, id_compra], (err, row) => {
            if(index == ids_compras.length -1){

                if (err) 
                {
                    res.send({ err: "Error al conectar con la base de datos" });
                }
                res.send("Actualizacion de estatus exitosa");
            }
            
        });
    })

    
};



module.exports = {createCompra, deleteCompra, updateStatus};