const conexion = require("../database");

const createInventario = async (req, res) => {
    var data = {
        id_branch: req.body.id_branch,
        ammountQueso : req.body.ammountQueso,
        ammountSalsa : req.body.ammountSalsa,
        ammountHarina : req.body.ammountHarina,
        ammountChampi : req.body.ammountChampi,
        ammountPina : req.body.ammountPina,
        ammountChiles : req.body.ammountChiles,
    };
    
    conexion.query("INSERT INTO inventory SET ?", [data], (err) => {
    if (err) 
    {
        res.send({ err: "Error al conectar con la base de datos" });
    }
        res.send("Registro exitoso");
    });
};

const deleteInvetario = async (req, res) => {
    var id_inventory = req.params.id_inventory;
    //Eliminacion de registro en base de datos
    conexion.query("DELETE FROM inventory WHERE id_inventory = ?", [id_inventory], (err) => {
        if (err) {
            res.send({err:'Error al eliminar el registro:'},);
        } else {
            res.send('Registro eliminado exitosamente');
        }
    });
};

const updateInvetario = (req, res) => {
    var id_inventory = req.params.id_inventory;
    var data = {
        id_branch: req.body.id_branch,
        ammountQueso : req.body.ammountQueso,
        ammountSalsa : req.body.ammountSalsa,
        ammountHarina : req.body.ammountHarina,
        ammountChampi : req.body.ammountChampi,
        ammountPina : req.body.ammountPina,
        ammountChiles : req.body.ammountChiles,
    };
    
    conexion.query("UPDATE inventory SET ? WHERE id_inventory = ?", [data, id_inventory], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Actualizacion exitosa");
    });
}


module.exports = {createInventario, updateInvetario, deleteInvetario};