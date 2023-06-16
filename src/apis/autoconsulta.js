const express = require("express");
const path = require('path');
const router = express.Router();
const tabla = 'quejas_tulio.tbl_queja';
const fs = require('fs');
const jwt = require("jsonwebtoken");
const secret = "123456";
var { conexion, realizarConsulta, realizarDml } = require('../db/conexion');

router.get("/obtenerqueja", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);
        const Siglas = req.query.siglas; // Obtener las Siglas de req.query en lugar de req.body
        var consulta = `SELECT queja.Siglas
        ,queja.Nombres
        ,queja.Apellidos
        ,queja.Correo_email
        ,estado.Descripcion FROM quejas_tulio.tbl_queja AS queja
        JOIN quejas_tulio.tbl_estado AS estado ON queja.Id_EstadoIni = estado.Id_Estado WHERE queja.Siglas= '${Siglas}'`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);
        res.status(200).send({ resultadoConsulta });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});





module.exports = router;

