
const conexion = require("../database");
const fs = require('fs'); //interactua con los archivos del proyecto
const config = require('dotenv');
config.config();
const path = require("path");
const _blobService = require("../blobservices");


const log = require("../log");


const createOferta = async (req, res) => {

    const blobName = req.file?.fieldname + "_" + Date.now() + path.extname(req.file.originalname);
    const {buffer} = req.file;

    log.logger.info("Blob name ---->" , blobName);
    log.logger.info("Buffer ---->" , buffer);

    await _blobService.updloadImage(blobName,buffer);

    var data = {
        name_ofert: req.body.name_ofert,
        discount: req.body.discount,
        description: req.body.description,
        image: blobName,
    };

    log.logger.info("data ---->" , data);
    conexion.query("INSERT INTO ofert SET ?", [data], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Registro exitoso");
    });

    
};


const deleteOferta = async (req, res) => {
    var id_ofert = req.params.id_ofert;
    eliminarImagen(id_ofert); 
    conexion.query("DELETE FROM ofert WHERE id_ofert = ?", [id_ofert], (err) => {
        if (err) {
            res.send({err:'Error al eliminar el registro:'},);
        } else {
            res.send('Registro eliminado exitosamente');
        }
    });
};


const updateOferta = (req, res) => {
    var id_ofert = req.params.id_ofert;
    const {buffer} = req.file;
    console.log("Buffer ---->" , buffer);

    var data = {
        name_ofert: req.body.name_ofert,
        discount: req.body.discount,
        description: req.body.description,
    };

    if(req?.file?.originalname !== undefined){
        const blobName = req.file?.fieldname + "_" + Date.now() + path.extname(req.file.originalname);

        data={...data, image:blobName }
    }
      
    actualizarImagen(id_ofert, data, buffer);



    conexion.query("UPDATE ofert SET ? WHERE id_ofert = ?", [data, id_ofert], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Actualizacion exitosa");
    });
}



const actualizarImagen = (id_ofert, data, buffer) => {
    conexion.query("SELECT image FROM ofert WHERE id_ofert = ?", [id_ofert], async (err, resultado) => {
        if (err) 
        {
            console.error('Error al obtener el nombre de la imagen:', err);
        }
  
        if (resultado.length === 0) 
        {
            console.error('Imagen no encontrada');
        }
    
        const nombreImagenBD = resultado[0].image;
        const imagenProyecto = data.image;
    
        if(imagenProyecto == null)
        {
          console.log('No viene la imagen', imagenProyecto)
        }
        else
        {
            await _blobService.deleteImage(nombreImagenBD);
            await _blobService.updloadImage(imagenProyecto,buffer);

        }
    });
};


const eliminarImagen = async (id_ofert) => {
    conexion.query("SELECT image FROM ofert WHERE id_ofert = ?", [id_ofert],  async (err, resultado) => {
        if (err) 
        {
            console.error('Error al obtener el nombre de la imagen:', err);
        }
    
        if (resultado.length === 0) 
        {
            console.error('Imagen no encontrada');
        }
    
        const nombreImagen = resultado[0].image;
        await _blobService.deleteImage(nombreImagen);
    });
};


module.exports = {createOferta, updateOferta, deleteOferta};