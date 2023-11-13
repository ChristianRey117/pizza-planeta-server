const conexion = require("../database");
const config = require('dotenv');
config.config();
const path = require("path");


const _blobService = require('@azure/storage-blob');

const blobService = _blobService.BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=cs710032000dda411cc;AccountKey=oEfje6qvbAHRKBZIg5r9r7NtyUW4DIaCWgOn5tMCnW7BHhKjX5aBSa5PzHQDSeFAZhp+D3FADf4D+ASt0ToVVA==;EndpointSuffix=core.windows.net")
const containerClient = blobService.getContainerClient("pizza-planeta");

const log = require("../log");

const createProducto = async (req, res) => {
    const blobName = req.file?.fieldname + "_" + Date.now() + path.extname(req.file.originalname);
    const {buffer} = req.file;

    log.logger.info("Blob name ---->" , blobName);
    log.logger.info("Buffer ---->" , buffer);

    await containerClient.getBlockBlobClient(blobName).uploadData(buffer);
    var data = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        id_ofert: req.body.id_ofert,
        id_type_category : req.body.id_type_category,
        image: blobName,
    };
  
    conexion.query("INSERT INTO product SET ?", [data], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Registro exitoso");
        });
};

const deleteProducto = async (req, res) => {
    var id_product = req.params.id_product;
    eliminarImagen(id_product); //se envia el id
  
    //Eliminacion de registro en base de datos
    conexion.query("DELETE FROM product WHERE id_product = ?", [id_product], (err) => {
        if (err) {
            res.send({err:'Error al eliminar el registro:'},);
        } else {
            res.send('Registro eliminado exitosamente');
        }
    });
};

const updateProducto = (req, res) => {
    var id_product = req.params.id_product;
    const {buffer} = req.file;
    //console.log(req.body);
    var data = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        id_ofert: req.body.id_ofert,
        id_type_category : req.body.id_type_category,
    };

    if(req?.file?.filename !== undefined){
        // data={...data, image:req.file.filename }
        const blobName = req.file?.fieldname + "_" + Date.now() + path.extname(req.file.originalname);

        data={...data, image:blobName }
    }
      
    actualizarImagen(id_product, data, buffer);
  
    conexion.query("UPDATE product SET ? WHERE id_product = ?", [data, id_product], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Actualizacion exitosa");
    });
}



const actualizarImagen = (id_product, data, buffer) => {
    // Consulta para obtener el nombre de la imagen
    conexion.query("SELECT image FROM product WHERE id_product = ?", [id_product], async (err, resultado) => {
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
            console.log('Si viene la imagen')
        
            const response = await containerClient.getBlockBlobClient(nombreImagenBD).deleteIfExists();
            console.log(response);
            await containerClient.getBlockBlobClient(imagenProyecto).uploadData(buffer);
        }
    });
};


const eliminarImagen = async (id_product) => {
    // Consulta para obtener el nombre de la imagen
    conexion.query("SELECT image FROM product WHERE id_product = ?", [id_product], async (err, resultado) => {
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
  

module.exports = {createProducto, deleteProducto, updateProducto};