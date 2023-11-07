const { error } = require("console");
const conexion = require("../database");
const fs = require('fs'); //interactua con los archivos del proyecto


const createSucursal = async (req, res, next) => {
  var data = {
    branch_name: req.body.branch_name,
    branch_direction: req.body.branch_direction,
    work_personnel: req.body.work_personnel,
    image: req.file.filename,
  };

  conexion.query("INSERT INTO branch SET ?", [data], (err, result) => {
    if (err) 
    {
      res.send({ err: "Error al conectar con la base de datos" });
    }

    const suppliers = JSON.parse(req.body.ids_supliers);
    let ocurrioError = false; //bandera de error
    console.log('proveedores: ', suppliers);
  
    suppliers.forEach(element => {
  
      var proveedores = {
        id_branch : result.insertId,
        id_supplier : element,
      };
  
      console.log(proveedores);
  
      conexion.query("INSERT INTO supplier_branch SET ?", [proveedores], (err2) => {
        if(err2)
        {
          ocurrioError = true; // si se produce el error entonces avisa al if de abajo;
        }
      });
    });
  
    if (ocurrioError) 
    {
      res.send({ error: "Error al insertar proveedores en supplier_branch" });
    } 
    else 
    {
      res.send("Registro exitoso de proveedores y de la sucursal");
      console.log("Registro exitoso de proveedores y de la sucursal");
    }

  });
};


const deleteSucursal = async (req, res) => {
  var id_branch = req.params.id_branch;
  eliminarProveedores(id_branch);
  eliminarImagen(id_branch); //se envia el id

  conexion.query("DELETE FROM branch WHERE id_branch = ?", [id_branch], (err) => {
    if (err) {
      res.send({err:'Error al eliminar el registro:'},);
      console.log('Error al eliminar la sucursal');
    } else {
      res.send('Registro eliminado exitosamente');
      console.log('Registro eliminado exitosamente');
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

/**PROVEEDORES */
const eliminarProveedores = (IDbranch) =>
{
  conexion.query("DELETE FROM supplier_branch WHERE id_branch = ?", [IDbranch], (err) => {
    if(err)
    {
      console.log('Error al eliminar los proveedores');
    }
    else
    {
      console.log('Proveedores eliminados exitosamente');
    }
  });
}



/**IMAGENES */
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


module.exports = { createSucursal, deleteSucursal, updateSucursal};
