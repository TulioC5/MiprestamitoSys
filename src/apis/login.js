
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = "123456";
var { conexion, realizarConsulta } = require('../db/conexion');

router.post("/login", async (req, res) =>{
    const {id: sub, username, password } = req.body;
    var consulta = "SELECT Count(*) AS REGISTROS FROM tbl_usuarios WHERE Usuario = '" + username + "' AND Contraseña = SHA2('" + password + "',256)";
    console.log(consulta);
    var resultadoConsulta = await realizarConsulta(consulta);
    console.log(resultadoConsulta[0]);
    if (resultadoConsulta[0].REGISTROS == 1){
        const token = jwt.sign({
            sub, user:username ,exp: Date.now() + 60 * 1000 * 24
        }, secret)
        res.status(200).send({ token });
    } else {
        res.status(401).send({Error: "No autorizado"})
    }
    
  
    //res.send({token})
})

router.post("/Ejemplodevolución", async (req, res) =>{
    const {id: sub, username, password } = req.body;
    var consulta = "SELECT Count(*) AS REGISTROS FROM tbl_usuarios";
    var resultadoConsulta = await realizarConsulta(consulta);
    console.log(resultadoConsulta);
    const token = jwt.sign({
        sub, exp: Date.now() + 60 * 1000 * 24
    }, secret)
    res.status(200).send({ resultadoConsulta, token });
    //res.send({token})
})

router.get("/private", (req,res) =>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)        
        if (Date.now() > payload.exp){
            return res.status(401).send({error: "token expirado"})
        }
        res.send("Soy privado")
    } catch (error) {
        res.status(401).send({error: error.message})
    }
})


module.exports = router;