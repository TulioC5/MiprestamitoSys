const express = require("express");
const path = require('path');
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
const tabla = 'quejas_tulio.tbl_queja';
const multer = require('multer');
const fs = require('fs');
var { conexion, realizarConsulta, realizarDml } = require('../db/conexion');
var {transporter, enviarCorreo} = require('../db/correos')
const storage = multer.diskStorage({
    destination: 'C:/Archivos', //crear
   filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    const newName = "Recibido" + ext; // Cambiar 'nuevo_nombre' por el nombre deseado
    cb(null, newName);
  }
  });
  const upload = multer({ storage: storage });

router.post("/ingresarQueja", upload.any(), async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        const {Nombres, Apellidos, Correo_email, Telefono, Detalle, Id_TQueja, Id_Origen } = req.body;
        var consulta = `select * from quejas_tulio.tbl_tipo_queja where Id_Tqueja = ${Id_TQueja}`;                
        var tiposQueja = await realizarConsulta(consulta);
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        var siglas = tiposQueja[0]['Siglas'] + "-" + tiposQueja[0]['Correlativo'] + "-" + year;
        console.log(siglas);
        const archivoAdjunto = req.files[0]; // Información del archivo adjunto
        const nuevaCarpeta = 'C:/Archivos/Quejas/'; // Ruta de la nueva carpeta
        var extension = path.extname(archivoAdjunto.originalname);
        const nombreArchivo = siglas + "-" + day + "-" + month + "-" + year + extension; // Obtener el nombre del archivo
        const rutaArchivoAnterior = archivoAdjunto.path; // Obtener la ruta del archivo temporal
        const nuevaRutaArchivo = nuevaCarpeta + nombreArchivo; // Construir la nueva ruta del archivo
        fs.renameSync(rutaArchivoAnterior, nuevaRutaArchivo); // Mover el archivo a la nueva ruta
        console.log(rutaArchivoAnterior);
        consulta = `INSERT INTO ${tabla}(Nombres, Apellidos, Correo_email, Telefono, Detalles, Id_TQueja, Id_Origen, Documento_Archivo, Id_PuntoA, Id_EstadoIni, Id_EstadoFin, Id_Usuario, Siglas) 
        VALUES ('${Nombres}','${Apellidos}', '${Correo_email}', '${Telefono}', '${Detalle}', '${Id_TQueja}', '${Id_Origen}', '${nuevaRutaArchivo}', 1,1,1, '${payload.user}', '${siglas}')`;                
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);
        if (resultadoConsulta == true){ 
        //Enviar correo de confirmación
        enviarCorreo('miprestamito@gmail.com', Correo_email, 'Queja ingresada correctamente', `Señor cuentahabiente,  agradecemos su comunicación,  le informamos que su queja ha sido recibida exitosamente. Para el seguimiento o cualquier consulta relacionada, no olvide que el número de su queja es ${siglas} `)
        .then((enviado) => {
          if (enviado) {
            console.log('Correo enviado correctamente');
          } else {
            console.log('Error al enviar el correo');
          }
        })
        .catch((error) => {
          console.error('Error al enviar el correo:', error);
        });
            consulta = `update quejas_tulio.tbl_tipo_queja set Correlativo = ${parseInt(tiposQueja[0]['Correlativo'] + 1)} where Id_Tqueja = ${Id_TQueja}`; 
            await realizarDml(consulta);
            consulta = `insert into quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"insertar"}', 
            'Descripcion: ${Detalle}, Nombres: ${Nombres} + ${Apellidos}', '${payload.user}', ${"Current_Timestamp"})`;
            console.log(consulta);
            await realizarDml(consulta);            
            res.status(201).send({ Ok: "Ok" });
        } else {
            res.status(400).send({Error: "Solicitud no válida"})
        }           
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})




router.get("/obtenerTipoQueja", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        var consulta = `SELECT * FROM ${tabla}`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(201).send({ resultadoConsulta });            
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})

router.post("/actualizarTipoQueja", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        const {id: sub,Id_TQueja, Descripcion, Siglas } = req.body;
        var consulta = `UPDATE ${tabla} set Descripcion = '${Descripcion}', Siglas = '${Siglas}' WHERE Id_Tqueja = ${Id_TQueja}`;        
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);
        if (resultadoConsulta == true){    
            consulta = `insert into quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"actualizar"}',
            'Id: ${Id_TQueja},Descripcion: ${Descripcion}, Siglas:${Siglas}', '${payload.user}', ${"Current_Timestamp"})`;
            console.log(consulta);
            var resultadoConsulta = await realizarDml(consulta);            
            res.status(200).send({ Ok: "Ok" });
        } else {
            res.status(400).send({Error: "Solicitud no válida"})
        }           
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})

router.post("/eliminarTipoQueja", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        const {id: sub,Id_TQueja} = req.body;
        var consulta = `UPDATE ${tabla} set Estado = 2 WHERE Id_Tqueja = ${Id_TQueja}`;        
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);
        if (resultadoConsulta == true){    
            consulta = `insert into quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"eliminar"}', 'Id: ${Id_TQueja}, Estado: 2', '${payload.user}', ${"Current_Timestamp"})`;
            console.log(consulta);
            var resultadoConsulta = await realizarDml(consulta);            
            res.status(200).send({ Ok: "Ok" });
        } else {
            res.status(400).send({Error: "Solicitud no válida"})
        }           
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})




module.exports = router;