
'use strict'
const express = require("express")
const bodyParser = require('body-parser') //interpretar el JSON
const hbs = require('express-handlebars')   //vistas
const path = require('path') //manejar direcciones de archivos
const app = express() 
const loginRoute = require("./src/apis/login")
const puntoAtencionRoute = require("./src/apis/punto_atencion")
const tipoQuejaRoute = require("./src/apis/tipo_queja")
const regionesRoute = require("./src/apis/regiones")
const quejasRoute = require("./src/apis/ingreso_queja")
const cargosRoute = require("./src/apis/cargos")
const autoRoute = require("./src/apis/autoconsulta")
const usuarioPuntoAtencion = require("./src/apis/usuario_Punto_Atencion")



const registroRoute = require("./src/apis/Registro_usuario")



const port = 3000

app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit:50000
}));


app.engine('.hbs', hbs.engine({
    defaultLayout: 'default',
    extname: '.hbs'})
);
app.set('view engine', '.hbs')

app.use("/api", loginRoute);
app.use("/api/punto_atencion", puntoAtencionRoute);
app.use("/api/tipo_queja", tipoQuejaRoute);
app.use("/api/regiones", regionesRoute);
app.use("/api/ingreso", quejasRoute);
app.use("/api/agregarusuario", registroRoute);
app.use("/api/cargosu", cargosRoute);
app.use("/api/autoc", autoRoute);
app.use("/api/usuarioPunto", usuarioPuntoAtencion);






app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/sweetalert2', express.static(path.join(__dirname, 'node_modules/sweetalert2/dist')))


app.get('/', (req, res) => {
    res.render('Portal');
});

app.get('/login',(req,res)=>{
    res.render('login')
});
// app.get('/',(req,res)=>{
//     res.render('login')
// });

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.get('/usuario-p-a', (req, res) => {
    res.render('usuario-p-a');
});


app.get('/home',(req,res)=>{
    res.render('home', {
        partials: {
            menu: 'menu'
        }
    });
});




app.get('/puntoatencion',(req,res)=>{
    res.render('punto-atencion');
});
app.get('/puntoatencion/agregar',(req,res)=>{
    res.render('punto-atencion-agregar');
});

app.get('/tipoqueja',(req,res)=>{
    res.render('tipo-queja');
});

app.get('/tipoqueja/agregar',(req,res)=>{
    res.render('tipo-queja-agregar');
});

app.get('/queja',(req,res)=>{
    const sigla = req.query.sigla;
    res.render('queja-new', {
        'sigla': sigla,
    });
});

app.get('/auto_consulta',(req,res)=>{
    const sigla = req.query.sigla;
    res.render('auto-consulta', {
        'sigla': sigla,
    });
});

app.get('/reporte',(req,res)=>{
    const sigla = req.query.sigla;
    res.render('reporte');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// module.exports = app;

