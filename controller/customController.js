const conexion = require("../database");
const fs = require('fs'); //interactua con los archivos del proyecto


const createSucursal = async (req, res, next) => {
  var data = {
    branch_name: req.body.branch_name,
    branch_direction: req.body.branch_direction,
    id_supplier: req.body.id_supplier,
    work_personnel: req.body.work_personnel,
    image: req.file.filename,
  };

  conexion.query("INSERT INTO branch SET ?", [data], (err, row) => {
    if (err) 
    {
      res.send({ err: "Error al conectar con la base de datos" });
    }
    res.send("Registro exitoso");
  });
};


const deleteSucursal = async (req, res) => {
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


const updateSucursal = (req, res) => {
  var id_branch = req.params.id_branch;
  console.log(id_branch);
  //console.log(req.body);
  var data = {
    branch_name: req.body.branch_name,
    branch_direction: req.body.branch_direction,
    id_supplier: req.body.id_supplier,
    work_personnel: req.body.work_personnel
  };
  if(req?.file?.filename !== undefined){
    data={...data, image:req.file.filename }
  }
    
  console.log(data);
  actualizarImagen(id_branch, data);


  conexion.query("UPDATE branch SET ? WHERE id_branch = ?", [data, id_branch], (err, row) => {
    if (err) 
    {
      res.send({ err: "Error al conectar con la base de datos" });
    }
    res.send("Actualizacion exitosa");
  });
}


const actualizarImagen = (id_branch, data) => {
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

    const nombreImagenBD = resultado[0].image;
    console.log('Imagen BD: ', nombreImagenBD);
    const imagenProyecto = data.image;
    console.log('Imagen Proyecto: ', imagenProyecto);

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





module.exports = { createSucursal, deleteSucursal, updateSucursal };
