
const conexion = require("../database");
const fs = require('fs'); //interactua con los archivos del proyecto
const config = require('dotenv');
config.config();

const _blobService = require('@azure/storage-blob');

const blobService = _blobService.BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)
const containerClient = blobService.getContainerClient("pizza-planeta");


const createOferta = async (req, res) => {

    const blobName = req.file.originalname;
    const {buffer} = req.file;

    console.log("Blob name ---->" , blobName);
    console.log("Buffer ---->" , buffer);

    await containerClient.getBlockBlobClient(blobName).uploadData(buffer)

    var data = {
        name_ofert: req.body.name_ofert,
        discount: req.body.discount,
        description: req.body.description,
        image: blobName,
    };
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
        data={...data, image:req.file.originalname }
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
            
            const response = await containerClient.getBlockBlobClient(nombreImagenBD).deleteIfExists();
            console.log(response);
            await containerClient.getBlockBlobClient(imagenProyecto).uploadData(buffer);

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
        const response = await containerClient.getBlockBlobClient(nombreImagen).deleteIfExists();
        console.log(response);
    });
};


module.exports = {createOferta, updateOferta, deleteOferta};