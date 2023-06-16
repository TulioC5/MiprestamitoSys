const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
const tabla = 'quejas_tulio.tbl_puntos_atencion';
var { conexion, realizarConsulta, realizarDml } = require('../db/conexion');

router.post("/agregarPunto", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        const {id: sub, Descripcion, Id_Region } = req.body;
        var consulta = `INSERT INTO quejas_tulio.tbl_puntos_atencion(Descripcion, Id_Region, Estado) VALUES ('${Descripcion}', ${Id_Region}, 1)`;        
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);
        if (resultadoConsulta == true){    
            consulta = `insert into quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"insertar"}', 'Descripcion: ${Descripcion}, Id_Region: ${Id_Region}', '${payload.user}', ${"Current_Timestamp"})`;
            console.log(consulta);
            var resultadoConsulta = await realizarDml(consulta);            
            res.status(201).send({ Ok: "Ok" });
        } else {
            res.status(400).send({Error: "Solicitud no válida"})
        }           
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})

router.get("/obtenerPuntos", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        var consulta = `SELECT * FROM quejas_tulio.tbl_puntos_atencion WHERE Estado = 1`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(200).send({ resultadoConsulta });            
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})

router.post("/actualizarPunto", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        const {id: sub,Id_PuntoA, Descripcion, Id_Region } = req.body;
        var consulta = `UPDATE quejas_tulio.tbl_puntos_atencion set Descripcion = '${Descripcion}', Id_Region = '${Id_Region}' WHERE Id_PuntoA = ${Id_PuntoA}`;        
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);
        if (resultadoConsulta == true){    
            consulta = `insert into quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"actualizar"}', 'Id: ${Id_PuntoA}, Id_Region: ${Id_Region}, Descripcion:${Descripcion}', '${payload.user}', ${"Current_Timestamp"})`;
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

router.post("/eliminarPunto", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        const {id: sub,Id_PuntoA} = req.body;
        var consulta = `UPDATE quejas_tulio.tbl_puntos_atencion set Estado = 2 WHERE Id_PuntoA = ${Id_PuntoA}`;        
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);
        if (resultadoConsulta == true){    
            consulta = `insert into quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"eliminar"}', 'Id: ${Id_PuntoA}, Estado: 2', '${payload.user}', ${"Current_Timestamp"})`;
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