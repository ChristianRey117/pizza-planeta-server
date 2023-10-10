const express = require("express");
const  conexion = require('./database');
const app = express();
const routes = require('./routes');

app.set('port', process.env.PORT || 5000);


//SERVER RUNNING ----------------------------------
app.listen(app.get('port'),() => {
  console.log("Server started on port", app.get('port'))
});



///ROUTES -------------------------------

app.get('/', (req, res) => {
  res.send('My api node')
});

app.use('/sucursales', routes)






