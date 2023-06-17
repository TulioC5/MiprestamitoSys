const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
const tabla = 'quejastulio.tbl_tipo_queja';
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
            consulta = `insert into quejastulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"insertar"}', 'Descripcion: ${Descripcion}, Siglas: ${Siglas}', '${payload.user}', ${"Current_Timestamp"})`;
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


router.get("/obtenerq", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);

        // Obtener los parámetros de fecha desde la solicitud
        const { desde, hasta } = req.query;

        // Generar la consulta SQL con los filtros de fecha
        let consulta = `SELECT queja.Siglas
        ,queja.Nombres
        ,queja.Apellidos
        ,queja.Correo_email
		,origen.Descripcion_Origen
		,queja.Fecha_Queja 
		,queja.Detalles
		,qtipo.Descripcion as Descripcion3
		,aten.Descripcion as Descripcion1
		,regi.Descripcion as Descripcion2
        ,estado.Descripcion FROM quejastulio.tbl_queja AS queja
        JOIN quejastulio.tbl_estado AS estado ON queja.Id_EstadoIni = estado.Id_Estado
        join quejastulio.tbl_queja_origen as origen on queja.Id_Origen 	= origen.Id_Origen 
        join quejastulio.tbl_puntos_atencion as aten on queja.Id_PuntoA = aten.Id_PuntoA 
        join quejastulio.tbl_regiones	     as regi on aten.Id_Region 	= regi.Id_Region
        join quejastulio.tbl_tipo_queja		as qtipo on queja.Id_Tqueja = qtipo.Id_Tqueja`;
        if (desde && hasta) {
            consulta += ` WHERE queja.Fecha_Queja  >= '${desde}' AND queja.Fecha_Queja  <= '${hasta}'`;
        }

        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);
        res.status(200).send({ resultadoConsulta });
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

module.exports = router;

























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
            consulta = `insert into quejastulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"actualizar"}',
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
            consulta = `insert into quejastulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"eliminar"}', 'Id: ${Id_TQueja}, Estado: 2', '${payload.user}', ${"Current_Timestamp"})`;
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
        var consulta = `SELECT * FROM quejastulio.tbl_queja_origen`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(200).send({ resultadoConsulta });            
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})




module.exports = router;