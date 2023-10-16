const conexion = require("../database");
const fs = require('fs'); //interactua con los archivos del proyecto


const createSucursal = async (req, res, next) => {
  console.log(req.file);
  var data = {
    branch_name: req.body.branch_name,
    branch_direction: req.body.branch_direction,
    id_supplier: req.body.id_supplier,
    work_personnel: req.body.work_personnel,
    image: req.file.filename,
  };
  console.log(data);

  conexion.query("INSERT INTO branch SET ?", [data], (err, row) => {
    if (err) 
    {
      res.send({ err: "Error al conectar con la base de datos" });
    }
    res.send("Registro exitoso");
  });
};


const deleteSucursal = (req, res) => {
  var id_branch = req.params.id_branch;
  eliminarImagen(id_branch); //se envia el id

  //Eliminacion de registro en base de datos
  conexion.query("DELETE FROM branch WHERE id_branch = ?", [id_branch], (err, rows) => {
    if (err) {
      res.send({err:'Error al eliminar el registro:'},);
    } else {
      res.send('Registro eliminado exitosamente');
    }
  });
};



const eliminarImagen = (id_branch) => {
  // Consulta para obtener el nombre de la imagen
  conexion.query("SELECT image FROM branch WHERE id_branch = ?", [id_branch], (err, resultado) => {
    if (err) 
    {
      console.error('Error al obtener el nombre de la imagen:', err);
    }

    if (resultado.length === 0) 
    {
      console.error('Imagen no encontrada');
    }

    const nombreImagen = resultado[0].image;
    console.log('nombre de la Imagen: ', nombreImagen);

    // Elimina la imagen del proyecto
    const rutaImagen = `public/images/${nombreImagen}`;
    console.log('ruta: ', rutaImagen);

    //fs.unlink(archivo a eliminar, error)
    fs.unlink(rutaImagen, (error) => {
      if (error) 
      {
        console.error('Error al eliminar la imagen:', error);
      }
      console.log('Imagen eliminada exitosamente');
    });
  });
};





module.exports = { createSucursal, deleteSucursal };
