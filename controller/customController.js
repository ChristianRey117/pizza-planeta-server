const { error } = require("console");
const conexion = require("../database");
const path = require("path");
const _blobService = require("../blobservices");


const createSucursal = async (req, res, next) => {

  const blobName = req.file?.fieldname + "_" + Date.now() + path.extname(req.file.originalname);
  const {buffer} = req.file;

  var data = {
    branch_name: req.body.branch_name,
    branch_direction: req.body.branch_direction,
    work_personnel: req.body.work_personnel,
    image: blobName,
  };

  await _blobService.updloadImage(blobName,buffer);
  conexion.query("INSERT INTO branch SET ?", [data], (err, result) => {
    if (err) 
    {
      res.send({ err: "Error al conectar con la base de datos" });
    }

    const suppliers = JSON.parse(req.body.ids_supliers);
    var ID = result.insertId;
    console.log('proveedores: ', suppliers, "id: " , ID);

    insertarProveedores(suppliers, ID);
    res.send('Registro exitoso');
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

  var data = {
    branch_name: req.body.branch_name,
    branch_direction: req.body.branch_direction,
    work_personnel: req.body.work_personnel
  };
  if(req?.file?.originalname !== undefined){
    const {buffer} = req.file;
    const blobName = req.file?.fieldname + "_" + Date.now() + path.extname(req.file.originalname);
    data={...data, image:blobName }
    console.log('Buffer->',buffer);
    console.log('Data->',data);
    actualizarImagen(id_branch, data, buffer);
  }

  if(req.body.ids_supliers) 
  {
    const suppliers = JSON.parse(req.body.ids_supliers);
    console.log('nuevos proveedores: ', suppliers, "id: " , id_branch);
    actualizarProveedores(suppliers, id_branch);
  } 
  
  conexion.query("UPDATE branch SET ? WHERE id_branch = ?", [data, id_branch], (err, row) => {
    if (err) 
    {
      res.send({ err: "Error al conectar con la base de datos" });
    }
    res.send("Actualizacion exitosa");
  });
};



/**PROVEEDORES */

const insertarProveedores = (suppliers, ID) =>
{
  let ocurrioError = false; //bandera de error

  suppliers.forEach(element => {
  
    var proveedores = {
      id_branch : ID,
      id_supplier : element,
    };

    console.log('fila: ', proveedores);
    
    conexion.query("INSERT INTO supplier_branch SET ?", [proveedores], (err2) => {
      if(err2)
      {
        ocurrioError = true; // si se produce el error entonces avisa al if de abajo;
      }
    });
  });

  if (ocurrioError) 
  {
    console.log("Error al insertar proveedores en supplier_branch");
  } 
  else 
  {
    console.log("Registro exitoso de proveedores y de la sucursal");
  }
}

const actualizarProveedores = (suppliers, id_branch) => {
  
  eliminarProveedores(id_branch);
  insertarProveedores(suppliers, id_branch);

}


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
const actualizarImagen = (id_branch, data, buffer) => {
  // Consulta para obtener el nombre de la imagen
  conexion.query("SELECT image FROM branch WHERE id_branch = ?", [id_branch], async(err, resultado) => {
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
      console.log('Si viene la imagen-->', buffer)
      await _blobService.deleteImage(nombreImagenBD);
      await _blobService.updloadImage(imagenProyecto, buffer);

    }
  });
};

const eliminarImagen = (id_branch) => {
  // Consulta para obtener el nombre de la imagen
  conexion.query("SELECT image FROM branch WHERE id_branch = ?", [id_branch], async(err, resultado) => {
    if (err) 
    {
      console.error('Error al obtener el nombre de la imagen:', err);
    }

    if (resultado.length === 0) 
    {
      console.error('Imagen no encontrada');
    }else{

      const nombreImagen = resultado[0].image;
      await _blobService.deleteImage(nombreImagen);
    }

   

  });
};


module.exports = { createSucursal, deleteSucursal, updateSucursal};
