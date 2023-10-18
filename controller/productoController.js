const conexion = require("../database");
const fs = require('fs'); //interactua con los archivos del proyecto


const createProducto = async (req, res) => {
    var data = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        id_ofert: req.body.id_ofert,
        id_type_category : req.body.id_type_category,
        image: req.file.filename,
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
    //console.log(req.body);
    var data = {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        id_ofert: req.body.id_ofert,
        id_type_category : req.body.id_type_category,
        image: req.file.filename,
    };
      
    actualizarImagen(id_product, data);
  
    conexion.query("UPDATE product SET ? WHERE id_product = ?", [data, id_product], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Actualizacion exitosa");
    });
}



const actualizarImagen = (id_product, data) => {
    // Consulta para obtener el nombre de la imagen
    conexion.query("SELECT image FROM product WHERE id_product = ?", [id_product], (err, resultado) => {
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
    
        if(nombreImagenBD === imagenProyecto)
        {
            console.log('los nombres de imagen coinciden')
        }
        else
        {
            console.log('los nombres de imagen NO coinciden')
            const rutaImagen = `public/images/${nombreImagenBD}`;
    
            fs.unlink(rutaImagen, (error) => {
                if (error) 
                {
                    console.error('Error al eliminar la imagen:', error);
                }
                console.log('Imagen eliminada exitosamente');
            });
        }
    });
};


const eliminarImagen = (id_product) => {
    // Consulta para obtener el nombre de la imagen
    conexion.query("SELECT image FROM product WHERE id_product = ?", [id_product], (err, resultado) => {
        if (err) 
        {
            console.error('Error al obtener el nombre de la imagen:', err);
        }
    
        if (resultado.length === 0) 
        {
            console.error('Imagen no encontrada');
        }
    
        const nombreImagen = resultado[0].image;
        const rutaImagen = `public/images/${nombreImagen}`;
            // Elimina la imagen del proyecto
        fs.unlink(rutaImagen, (error) => {
            if (error) 
            {
            console.error('Error al eliminar la imagen:', error);
            }
            console.log('Imagen eliminada exitosamente');
        });
    });
};
  

module.exports = {createProducto, deleteProducto, updateProducto};