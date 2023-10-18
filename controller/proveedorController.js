const conexion = require("../database");
const fs = require('fs'); //interactua con los archivos del proyecto

const createProveedor = async(req, res) => {
    var data = {
        supplier_name: req.body.supplier_name,
        supplier_product: req.body.supplier_product,
        image: req.file.filename,
    };
    conexion.query("INSERT INTO supplier SET ?", [data], (err) => {
        if (err) 
        {
          res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Registro exitoso");
    });
}

const deleteProveedor = async (req, res) => {
    var id_supplier = req.params.id_supplier;
    eliminarImagen(id_supplier);
    conexion.query("DELETE FROM supplier WHERE id_supplier = ?", [id_supplier], (err) => {
        if (err) {
          res.send({err:'Error al eliminar el registro:'},);
        } else {
          res.send('Registro eliminado exitosamente');
        }
    });
};

const updateProveedor = (req, res) => {
    var id_supplier = req.params.id_supplier;
    var data = {
          supplier_name: req.body.supplier_name,
          supplier_product: req.body.supplier_product,
      };
    
    if(req?.file?.filename !== undefined){
      data={...data, image:req.file.filename }
    }
    
  actualizarImagen(id_supplier, data);

  conexion.query("UPDATE supplier SET ? WHERE id_supplier = ?", [data, id_supplier], (err) => {
    if (err) 
    {
      res.send({ err: "Error al conectar con la base de datos" });
    }
    res.send("Actualizacion exitosa");
  });
}



const actualizarImagen = (id_supplier, data) => {
  conexion.query("SELECT image FROM supplier WHERE id_supplier = ?", [id_supplier], (err, resultado) => {
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
              
      const rutaImagen = `public/images/${nombreImagenBD}`;
      console.log('ruta: ', rutaImagen);
          
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


const eliminarImagen = (id_supplier) => {
  conexion.query("SELECT image FROM supplier WHERE id_supplier = ?", [id_supplier], (err, resultado) => {
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
}

module.exports = {createProveedor, deleteProveedor, updateProveedor};