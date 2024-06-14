const nodemailer = require('nodemailer');
const ContactosModel = require('../ContactosModel');
require('dotenv').config();



class ContactosController {
    constructor() {
      this.modeloFacade = new ContactosModel();
      this.modeloFacade.conectardb();
    }
  
    async saveForm(req, res) {
      const { name, email, commentary } = req.body;
      const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
      const fecha = new Date().getTime();
  
      const url = 'http://ipwho.is/' + ip;
      const responseCountry = await fetch(url);
      const jsonCountry = await responseCountry.json();
      const country = jsonCountry.country;
  
      const responseGoogle = req.body["g-recaptcha-response"];
      const secretGoogle = process.env.PRIVATEKEY;
      const urlG = `https://www.google.com/recaptcha/api/siteverify?secret=${secretGoogle}&response=${responseGoogle}`;
      const recaptchaGoogle = await fetch(urlG, { method: "post", });
      const googleResult = await recaptchaGoogle.json();
  
      if (googleResult.success) {
  
        let transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secureConnection: false,
          auth: {
            user: process.env.EMAILTEST,
            pass: process.env.PASSWORDTEST
          },
          debug: true
        });
  
        const customer = `
  
          <p>Email: ${email}</p>
          <p>Name: ${name}</p>
          <p>Message: ${commentary}</p>
          <p>Date Time: ${fecha}</p>
          <p>Country: ${country}</p>
          <p>Ip: ${ip}</p>
                              `;
  
        const receiver = {
          from: process.env.EMAILTEST,
          to: 'programacion2ais@dispostable.com',
          subject: 'Data client',
          html: customer
        };
  
  
        transporter.sendMail(receiver, (err, info) => {
          if (err) {
            console.log(err)
          }
  
          else {
            this.modeloFacade.guardardb(name, email, commentary, ip, fecha, country);
            res.send('Formulario y correo enviado');
          }
  
        })
      } else {
        res.send('Error en el captcha')
      }
  
  
    }
    
  }

module.exports = ContactosController