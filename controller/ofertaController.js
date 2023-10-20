const conexion = require("../database");
const fs = require('fs'); //interactua con los archivos del proyecto


const createOferta = async (req, res) => {
    var data = {
        name_ofert: req.body.name_ofert,
        discount: req.body.discount,
        description: req.body.description,
        image: req.file.filename,
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
    var data = {
        name_ofert: req.body.name_ofert,
        discount: req.body.discount,
        description: req.body.description,
    };

    if(req?.file?.filename !== undefined){
        data={...data, image:req.file.filename }
    }
      
    actualizarImagen(id_ofert, data);
  
    conexion.query("UPDATE ofert SET ? WHERE id_ofert = ?", [data, id_ofert], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Actualizacion exitosa");
    });
}



const actualizarImagen = (id_ofert, data) => {
    conexion.query("SELECT image FROM ofert WHERE id_ofert = ?", [id_ofert], (err, resultado) => {
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
            const rutaImagen = `public/images/${nombreImagenBD}`;
            //console.log('ruta: ', rutaImagen);
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


const eliminarImagen = (id_ofert) => {
    conexion.query("SELECT image FROM ofert WHERE id_ofert = ?", [id_ofert], (err, resultado) => {
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
        fs.unlink(rutaImagen, (error) => {
            if (error) 
            {
                console.error('Error al eliminar la imagen:', error);
            }
            console.log('Imagen eliminada exitosamente');
        });
    });
};


module.exports = {createOferta, updateOferta, deleteOferta};