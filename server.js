const express = require("express");
const conexion = require("./database");
const app = express();
const sucursalRoutes = require("./routes/route-sucursales/sucursales-routes");
const proveedorRoutes = require("./routes/route-proveedores/proveedores-routes");
const productoRoutes = require("./routes/route-productos/productos-routes");
const inventarioRoutes = require("./routes/route-inventario/inventario-routes");
const vecindarioRoutes = require("./routes/route-vecindario/vecindario-routes");
const tipocategoriaRoutes = require("./routes/route-tipo-categoria/tipo-categoria-routes");
const ofertaRoutes = require("./routes/route-ofertas/ofertas-routes");
const tipousuarioRoutes = require("./routes/route-tipo-usuario/tipo-usuario-routes");



const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.static("public"));

app.set("port", process.env.PORT || 5000);

//SERVER RUNNING ----------------------------------
app.listen(app.get("port"), () => {
  console.log("Server started on port", app.get("port"));
});

///ROUTES -------------------------------

app.get("/", (req, res) => {
  res.send("My api node");
});

app.use("/sucursales", sucursalRoutes);
app.use("/proveedores", proveedorRoutes);
app.use('/productos', productoRoutes);
app.use('/inventario', inventarioRoutes);
app.use('/vecindarios', vecindarioRoutes);
app.use('/tipocategoria', tipocategoriaRoutes);
app.use('/ofertas', ofertaRoutes);
app.use('/tipousuario', tipousuarioRoutes);

