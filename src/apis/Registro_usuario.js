const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
const tabla = 'quejas_tulio.tbl_usuarios';
const multer = require('multer');
const fs = require('fs');
var { conexion, realizarConsulta, realizarDml } = require('../db/conexion');
var {transporter, enviarCorreo} = require('../db/correos')

const app = express();


router.post("/agregaruser", async (req, res) =>{
    try {
        const {id: sub, Usuario, Contraseña, Nombres, Apellidos, Correo_email, Fecha_Nacimiento, Cui, Departamento, NUMEROCUENTA,ConfirmarContraseña} = req.body;

        if (Contraseña !== ConfirmarContraseña) {
            res.status(400).send({ Error: "Las contraseñas no coinciden" });
            return;
        }

         var consulta = `INSERT INTO quejas_tulio.tbl_usuarios(Usuario, Contraseña, Nombres, Apellidos, Correo_email, Fecha_Nacimiento, Cui, Departamento,Id_Rol,Id_Cargo,Id_PuntoA, NUMEROCUENTA,ESTADO) VALUES ('${Usuario}', SHA2('${Contraseña}', 256),'${Nombres}','${Apellidos}', '${Correo_email}','${Fecha_Nacimiento}','${Cui}','${Departamento}','4','1','1','${NUMEROCUENTA}', '1')`;        
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);

            if (resultadoConsulta == true){ 
                //Enviar correo de confirmación
                enviarCorreo('miprestamito@gmail.com', Correo_email, 'Usuario registrado correctamente', `Señor cuentahabiente Bienvenido al Portal mi prestamito, no olvide que su usuario es: ${Usuario} `)
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
                    res.status(201).send({ Ok: "Ok" });
                } else {
                    res.status(400).send({Error: "Solicitud no válida"})
                }           
            }catch (error) {
                res.status(401).send({error: error.message})
            }        
        })
        
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());


module.exports = router;


