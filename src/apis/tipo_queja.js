const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
const tabla = 'quejas_tulio.tbl_tipo_queja';
var { conexion, realizarConsulta, realizarDml } = require('../db/conexion');

router.post("/agregarTipoQueja", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        const {id: sub, Descripcion, Siglas,  } = req.body;
        var consulta = `INSERT INTO ${tabla}(Descripcion, Siglas, Estado, Correlativo) VALUES ('${Descripcion}', '${Siglas}', 1, 0)`;        
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);
        if (resultadoConsulta == true){    
            consulta = `insert into quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"insertar"}', 'Descripcion: ${Descripcion}, Siglas: ${Siglas}', '${payload.user}', ${"Current_Timestamp"})`;
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

router.get("/obtenerTipoQueja", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        var consulta = `SELECT * FROM ${tabla} WHERE estado = 1`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(200).send({ resultadoConsulta });            
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

router.get("/obtenerOrigenQueja", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        var consulta = `SELECT * FROM quejas_tulio.tbl_queja_origen`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(200).send({ resultadoConsulta });            
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})




module.exports = router;