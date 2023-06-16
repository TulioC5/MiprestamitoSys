const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'clientesmiprestamito@gmail.com', // dirección de correo 
      pass: 'dbgtnojdtiwpmwkm', // contraseña de correo 
    },
  });

  const mailOptions = {
    from: 'tucorreo@gmail.com', // La dirección de correo electrónico del remitente
    to: 'destinatario@gmail.com', // La dirección de correo electrónico del destinatario
    subject: 'Asunto del correo', // El asunto del correo
    text: 'Contenido del correo', // El contenido del correo en formato de texto plano
  };


  function enviarCorreo(from, to, subject, text) {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          resolve(false);
        } else {
          console.log('Correo enviado: ' + info.response);
          resolve(true);
        }
      });
    });
  }

  module.exports = {
    transporter: transporter,
    enviarCorreo: enviarCorreo,    
};