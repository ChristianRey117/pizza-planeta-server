const conexion = require("../database");

const createVecindario = async (req, res) => {
    var data = {
        id_branch: req.body.id_branch,
        neighborhood_name : req.body.neighborhood_name,
        status_item: req.body.status_item || 'activo',
    };
    
    conexion.query("INSERT INTO neighborhood SET ?", [data], (err) => {
    if (err) 
    {
        res.send({ err: "Error al conectar con la base de datos" });
    }
        res.send("Registro exitoso");
    });
};

const deleteVecindario = async (req, res) => {
    var id_neighborhood = req.params.id_neighborhood;
    conexion.query("UPDATE neighborhood SET status_item = 'inactivo' WHERE id_neighborhood = ?", [id_neighborhood], (err) => {
        if (err) {
            res.send({err:'Error al eliminar el registro:'},);
        } else {
            res.send('Registro eliminado exitosamente');
        }
    });
};


const updateVecindario = (req, res) => {
    var id_neighborhood = req.params.id_neighborhood;
    var data = {
        id_branch: req.body.id_branch,
        neighborhood_name : req.body.neighborhood_name,
    };
    
    conexion.query("UPDATE neighborhood SET ? WHERE id_neighborhood = ?", [data, id_neighborhood], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Actualizacion exitosa");
    });
}

module.exports = {createVecindario, updateVecindario, deleteVecindario};