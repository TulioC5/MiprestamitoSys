const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
const tabla = 'quejas_tulio.tbl_usuarios ';
var { conexion, realizarConsulta, realizarDml } = require('../db/conexion');

router.post("/eliminarUsuario", async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const payload = jwt.verify(token, secret);
      const { Id_Usuario } = req.body;
      var consulta = `UPDATE ${tabla} SET ESTADO = 2  WHERE Id_Usuario = ${Id_Usuario}`;
      console.log(consulta);
      var resultadoConsulta = await realizarDml(consulta);
      console.log(resultadoConsulta);
      if (resultadoConsulta == true) {
        consulta = `INSERT INTO quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"actualizar"}', 'Id: ${Id_Usuario}, Estado: 2', '${payload.user}', CURRENT_TIMESTAMP)`;
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        res.status(200).send({ Ok: "Ok" });
      } else {
        res.status(400).send({ Error: "Solicitud no válida" });
      }
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  });

  router.post("/cambiarRol", async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const payload = jwt.verify(token, secret);
      const { Id_Usuario, Id_Rol } = req.body;
      var consulta = `UPDATE ${tabla} SET Id_Rol = ${Id_Rol}  WHERE Id_Usuario = ${Id_Usuario}`;
      console.log(consulta);
      var resultadoConsulta = await realizarDml(consulta);
      console.log(resultadoConsulta);
      if (resultadoConsulta == true) {
        consulta = `INSERT INTO quejas_tulio.tbl_bitacora_db(Tbl_Nombre, Accion, Registro_Despues, Usuario, Fecha) VALUES ('${tabla}', '${"actualizar"}', 'Id: ${Id_Usuario}, Id_Rol: ${Id_Rol}', '${payload.user}', CURRENT_TIMESTAMP)`;
        console.log(consulta);
        var resultadoConsulta = await realizarDml(consulta);
        res.status(200).send({ Ok: "Ok" });
      } else {
        res.status(400).send({ Error: "Solicitud no válida" });
      }
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  });

router.get("/obtenerUsuarios", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        var consulta = `select Id_usuario, Usuario, Nombres, Apellidos, Correo_email, Fecha_Nacimiento, Cui, Departamento, tr.Descripcion as Nombre_Rol, tu.Id_Rol 
        from tbl_usuarios tu 
        inner join tbl_roles tr
            on tu.Id_Rol = tr.Id_Rol 
        where tu.ESTADO = 1`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(200).send({ resultadoConsulta });            
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})

router.get("/obtenerRoles", async (req, res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        var consulta = `select * from tbl_roles`;
        console.log(consulta);
        var resultadoConsulta = await realizarConsulta(consulta);
        console.log(resultadoConsulta);                 
        res.status(200).send({ resultadoConsulta });            
    }catch (error) {
        res.status(401).send({error: error.message})
    }        
})





module.exports = router;