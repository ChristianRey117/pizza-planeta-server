const conexion = require("../database");

const createTipoCategoria = async (req, res) => {
    var data = {
        name_category: req.body.name_category,
        description : req.body.description,
        status_item: req.body.status_item || 'activo',
    };
    
    conexion.query("INSERT INTO type_category SET ?", [data], (err) => {
    if (err) 
    {
        res.send({ err: "Error al conectar con la base de datos" });
    }
        res.send("Registro exitoso");
    });
};

const deleteTipoCategoria = async (req, res) => {
    var id_category = req.params.id_category;
    conexion.query("UPDATE type_category SET status_item = 'inactivo' WHERE id_category = ?", [id_category], (err) => {
        if (err) {
            res.send({err:'Error al eliminar el registro:'},);
        } else {
            res.send('Registro eliminado exitosamente');
        }
    });
};

const updateTipoCategoria = (req, res) => {
    var id_category = req.params.id_category;
    var data = {
        name_category: req.body.name_category,
        description : req.body.description,
    };
    
    conexion.query("UPDATE type_category SET ? WHERE id_category = ?", [data, id_category], (err) => {
        if (err) 
        {
            res.send({ err: "Error al conectar con la base de datos" });
        }
        res.send("Actualizacion exitosa");
    });
}

module.exports = {createTipoCategoria, updateTipoCategoria, deleteTipoCategoria};