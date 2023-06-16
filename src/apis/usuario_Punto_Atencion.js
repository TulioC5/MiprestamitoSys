const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
const tabla = 'quejas_tulio.tbl_usuarios';
var { conexion, realizarConsulta, realizarDml } = require('../db/conexion');



router.get("/obtenerusuariosPA", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        var consulta = `SELECT Usuario, Nombres, Apellidos, Cui, Correo_Email, tbl_puntos_atencion.Descripcion as 'Descripcion1' , tbl_cargos.Descripcion, tbl_regiones.Descripcion as 'Descripcion2'  FROM tbl_usuarios
        join 
tbl_puntos_atencion				on tbl_usuarios.Id_PuntoA 	= tbl_puntos_atencion.Id_PuntoA
        JOIN
tbl_cargos						ON tbl_usuarios.Id_Cargo	= tbl_cargos.Id_Cargo
          JOIN
tbl_regiones					on tbl_puntos_atencion.Id_Region	= tbl_regiones.Id_Region where tbl_usuarios.ESTADO = 1`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(200).send({ resultadoConsulta });
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})


router.post("/asignarPuntoUsuario", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        const {Id_PuntoA, Id_Cargo, Usuario } = req.body;
        var consulta = `UPDATE ${tabla} set Id_Cargo = ${Id_Cargo}, Id_PuntoA = ${Id_PuntoA} WHERE Usuario = '${Usuario}'`;        
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);
        if (resultadoConsulta == true){    
            consulta = `insert into quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"actualizar"}', 'Usuario: ${Usuario}, Id_Cargo: ${Id_Cargo}, Id_PuntoA:${Id_PuntoA}', '${payload.user}', ${"Current_Timestamp"})`;
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

router.post("/eliminarPuntoUsuario", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        const {Usuario } = req.body;
        const Id_PuntoA = 1;        
        const Id_Cargo = 1;        
        const ESTADO = 0;
        var consulta = `UPDATE ${tabla} set Id_Cargo = ${Id_Cargo}, Id_PuntoA = ${Id_PuntoA}, ESTADO = ${ESTADO} WHERE Usuario = '${Usuario}'`;        
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        console.log(resultadoConsulta);
        if (resultadoConsulta == true){    
            consulta = `insert into quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"actualizar"}', 'Usuario: ${Usuario}, Id_Cargo: ${Id_Cargo}, Id_PuntoA:${Id_PuntoA}', '${payload.user}', ${"Current_Timestamp"})`;
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