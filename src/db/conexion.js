var mysql = require('mysql');
var conexion= mysql.createConnection({
    host : 'den1.mysql1.gear.host',
    database : 'quejastulio',
    user : 'root111',
    password : '@52547189',
});
conexion.connect(function(err) {
    if (err) {
        console.error('Error de conexion: ' + err.stack);
        return;
    }
    console.log('Conectado con el identificador ' + conexion.threadId);
});

async function  realizarConsulta(query) {
    return new Promise((resolve, reject) => {
        conexion.query(query, function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

async function  realizarDml(query) {
    return new Promise((resolve, reject) => {
        conexion.query(query, function (error, results, fields) {
            if (error) {
                reject(false);
            } else {                
                resolve(true);
            }
        });
    });
}

module.exports = {
    conexion: conexion,
    realizarConsulta: realizarConsulta,
    realizarDml: realizarDml
};