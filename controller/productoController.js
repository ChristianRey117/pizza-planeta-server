const conexion = require("../database");
const config = require('dotenv');
config.config();
const path = require("path");
const _blobService = require("../blobservices");

const log = require("../log");

const createProducto = async (req, res) => {
    const blobName = req.file?.fieldname + "_" + Date.now() + path.extname(req.file.originalname);
    const {buffer} = req.file;

    log.logger.info("Blob name ---->" , blobName);
    log.logger.info("Buffer ---->" , buffer);

    await _blobService.updloadImage(blobName,buffer);
    var data = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        id_ofert: req.body.id_ofert,
        id_type_category : req.body.id_type_category,
        image: blobName,
        status_item: req.body.status_item || 'activo',
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
  
    conexion.query("UPDATE product SET status_item = 'inactivo' WHERE id_product = ?", [id_product], (err) => {
        if (err) {
            res.send({err:'Error al eliminar el registro:'},);
        } else {
            res.send('Registro eliminado exitosamente');
        }
    });
};

const updateProducto = (req, res) => {
    var id_product = req.params.id_product;
    //console.log(req.body);
    var data = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        id_ofert: req.body.id_ofert,
        id_type_category : req.body.id_type_category,
    };

    if(req?.file?.originalname !== undefined){
        const {buffer} = req.file;
        const blobName = req.file?.fieldname + "_" + Date.now() + path.extname(req.file.originalname);
        data={...data, image:blobName }
        actualizarImagen(id_product, data, buffer);

    }

      
  
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
        
            await _blobService.deleteImage(nombreImagenBD);
            await _blobService.updloadImage(imagenProyecto, buffer);
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
       await _blobService.deleteImage(nombreImagen);
    });
};
  

module.exports = {createProducto, deleteProducto, updateProducto};