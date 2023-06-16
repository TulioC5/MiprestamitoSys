const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
const tabla = 'quejas_tulio.tbl_queja';
var { conexion, realizarConsulta, realizarDml } = require('../db/conexion');



router.get("/obtenerq", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        var consulta = `SELECT * from quejas_tulio.tbl_queja`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(200).send({ resultadoConsulta });
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})


module.exports = router;