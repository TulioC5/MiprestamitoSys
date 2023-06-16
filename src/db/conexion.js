var mysql = require('mysql');
var conexion= mysql.createConnection({
    host : 'us-cdbr-east-06.cleardb.net',
    database : 'heroku_6f18d24c0ac41a5',
    user : 'b3be56d84e3e72',
    password : '090de5db',
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