const conexion = require("../database");
const path = require("path");

const _blobService = require("../blobservices");


const createProveedor = async(req, res) => {
    const blobName = req.file.fieldname + "_" + Date.now() + path.extname(req.file.originalname);
    const {buffer} = req.file;
    var data = {
        supplier_name: req.body.supplier_name,
        supplier_product: req.body.supplier_product,
        image: blobName
    };

    await _blobService.updloadImage(blobName,buffer);
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
    const {buffer} = req.file;
    console.log("Buffer ---->" , buffer);

    var data = {
          supplier_name: req.body.supplier_name,
          supplier_product: req.body.supplier_product,
      };
    
    if(req?.file?.originalname !== undefined){
      data={...data, image:req.file.fieldname + "_" + Date.now() + path.extname(req.file.originalname) }
    }
    
  actualizarImagen(id_supplier, data, buffer);

  conexion.query("UPDATE supplier SET ? WHERE id_supplier = ?", [data, id_supplier], (err) => {
    if (err) 
    {
      res.send({ err: "Error al conectar con la base de datos" });
    }
    res.send("Actualizacion exitosa");
  });
}



const actualizarImagen = (id_supplier, data, buffer) => {
  conexion.query("SELECT image FROM supplier WHERE id_supplier = ?", [id_supplier], async(err, resultado) => {
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
      await _blobService.deleteImage(nombreImagenBD);
      await _blobService.updloadImage(imagenProyecto, buffer);
    }
  });
};


const eliminarImagen = (id_supplier) => {
  conexion.query("SELECT image FROM supplier WHERE id_supplier = ?", [id_supplier], async(err, resultado) => {
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
}

module.exports = {createProveedor, deleteProveedor, updateProveedor};