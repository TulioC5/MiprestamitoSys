const express = require("express");
const path = require('path');
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
const tabla = 'quejastulio.tbl_queja';
const multer = require('multer');
const { conexion, realizarConsulta, realizarDml } = require('../db/conexion');
const { transporter, enviarCorreo } = require('../db/correos');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/ingresarQueja", upload.single('File'), async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);
        const { Nombres, Apellidos, Correo_email, Telefono, Detalle, Id_TQueja, Id_Origen } = req.body;

        const tiposQueja = await realizarConsulta(`SELECT * FROM quejastulio.tbl_tipo_queja WHERE Id_Tqueja = ${Id_TQueja}`);
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const siglas = tiposQueja[0]['Siglas'] + "-" + tiposQueja[0]['Correlativo'] + "-" + year;

        const archivoAdjunto = req.file; // Información del archivo adjunto

        const consulta = `INSERT INTO ${tabla}(Nombres, Apellidos, Correo_email, Telefono, Detalles, Id_TQueja, Id_Origen, Documento_Archivo, Id_PuntoA, Id_EstadoIni, Id_EstadoFin, Id_Usuario, Siglas) 
        VALUES ('${Nombres}','${Apellidos}', '${Correo_email}', '${Telefono}', '${Detalle}', '${Id_TQueja}', '${Id_Origen}', '${archivoAdjunto.buffer.toString('base64')}', 1,1,1, '${payload.user}', '${siglas}')`;

        const resultadoConsulta = await realizarDml(consulta);

        if (resultadoConsulta === true) {
            // Enviar correo de confirmación
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

            // Consulta para seleccionar los correos electrónicos de los usuarios
            const consultaCorreo = "SELECT Correo_email FROM tbl_usuarios  WHERE Id_Cargo = 7"; // Ajusta la consulta según tus necesidades

            // Realizar la consulta de los correos electrónicos
            const correos = await realizarConsulta(consultaCorreo);

            // Iterar sobre los resultados y enviar correos electrónicos individuales
            for (const correo of correos) {
                const destinatario = correo.Correo_email;
                const asunto = "Nueva Queja Ingresada";
                const contenido = "El sistema de quejas le informa que se ha recibido una queja, la cual debe ser asignada dentro de las próximas 24 horas.";

                // Llamar a la función de envío de correo electrónico
                enviarCorreo('miprestamito@gmail.com', destinatario, asunto, contenido)
                    .then((enviado) => {
                        if (enviado) {
                            console.log(`Correo enviado correctamente a ${destinatario}`);
                        } else {
                            console.log(`Error al enviar el correo a ${destinatario}`);
                        }
                    })
                    .catch((error) => {
                        console.error(`Error al enviar el correo a ${destinatario}:`, error);
                    });
            }

            await realizarDml(`UPDATE quejastulio.tbl_tipo_queja SET Correlativo = ${parseInt(tiposQueja[0]['Correlativo'] + 1)} WHERE Id_Tqueja = ${Id_TQueja}`);
            await realizarDml(`INSERT INTO quejastulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', 'insertar', 'Descripcion: ${Detalle}, Nombres: ${Nombres} + ${Apellidos}', '${payload.user}', CURRENT_TIMESTAMP)`);

            res.status(201).send({ Ok: "Ok" });
        } else {
            res.status(400).send({ Error: "Solicitud no válida" });
        }
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

router.get("/obtenerTipoQueja", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);
        const consulta = `SELECT * FROM ${tabla}`;
        const resultadoConsulta = await realizarConsulta(consulta);
        res.status(200).send({ resultadoConsulta });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

router.post("/actualizarTipoQueja", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);
        const { id: sub, Id_TQueja, Descripcion, Siglas } = req.body;
        const consulta = `UPDATE ${tabla} SET Descripcion = '${Descripcion}', Siglas = '${Siglas}' WHERE Id_Tqueja = ${Id_TQueja}`;
        const resultadoConsulta = await realizarDml(consulta);
        if (resultadoConsulta === true) {
            await realizarDml(`INSERT INTO quejastulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', 'actualizar', 'Id: ${Id_TQueja}, Descripcion: ${Descripcion}, Siglas:${Siglas}', '${payload.user}', CURRENT_TIMESTAMP)`);
            res.status(200).send({ Ok: "Ok" });
        } else {
            res.status(400).send({ Error: "Solicitud no válida" });
        }
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

router.post("/eliminarTipoQueja", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);
        const { id: sub, Id_TQueja } = req.body;
        const consulta = `UPDATE ${tabla} SET Estado = 2 WHERE Id_Tqueja = ${Id_TQueja}`;
        const resultadoConsulta = await realizarDml(consulta);
        if (resultadoConsulta === true) {
            await realizarDml(`INSERT INTO quejastulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', 'eliminar', 'Id: ${Id_TQueja}, Estado: 2', '${payload.user}', CURRENT_TIMESTAMP)`);
            res.status(200).send({ Ok: "Ok" });
        } else {
            res.status(400).send({ Error: "Solicitud no válida" });
        }
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

module.exports = router;
