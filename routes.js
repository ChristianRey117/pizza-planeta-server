const express = require("express");
const routes = express.Router();
const  conexion = require('./database');


routes.get('/', (req, res) => {

  conexion.query('SELECT branch.id_branch, branch.branch_name, branch.branch_direction, branch.work_personnel, supplier.supplier_name AS supplier' +
                ' FROM branch' +
                ' JOIN supplier ON branch.id_supplier = supplier.id_supplier', 
    (err, rows) => {
      if(err)
        {
          throw err;
        }
      res.json(rows);
    });
});






module.exports = routes;