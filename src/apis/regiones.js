const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
const tabla = 'quejas_tulio.tbl_regiones';
var { conexion, realizarConsulta, realizarDml } = require('../db/conexion');

router.get("/obtenerRegiones", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        var consulta = `SELECT * FROM ${tabla}`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(200).send({ resultadoConsulta });
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})

module.exports = router;