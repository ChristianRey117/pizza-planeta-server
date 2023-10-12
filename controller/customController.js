const conexion = require("../database");

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
    if (err) {
      res.send({ erro: "Error al conectar con la base de datos" });
    }

    res.send("Registro exitoso");
  });
};
module.exports = { createSucursal };
