var express = require('express');
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require('path');

class ContactosModel{
  constructor(){
    this.db = new sqlite3.Database(path.join(__dirname, "/basededatos", "base.db"), (err) => {
      if(err){
        console.log('Error en la base de datos')
      }
      console.log('Base de datos creada')
    });
  }

  conectardb(){
    this.db.run('CREATE TABLE contactos(nombre VARCHAR(255), correo VARCHAR(255), comentario TEXT,ip TEXT,fecha TEXT)');
}
  
  guardardb(name,email,commentary,ip,fecha){
    this.db.run("INSERT INTO contactos VALUES (?, ?, ?, ?, ?)", [name, email, commentary, ip, fecha]);
  }
}

class ContactosController{
  constructor(){
    this.modeloFacade = new ContactosModel();
    this.modeloFacade.conectardb();
  }

  saveForm(req,res){
    const { name, email, commentary} = req.body;
    const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
    const fecha = new Date().getTime();
    this.modeloFacade.guardardb(name,email,commentary,ip,fecha);
    res.send('Formulario guardado')
    
  }
}

const controllerFacade = new ContactosController();
router.post('/sendForm',(req,res,next) => controllerFacade.saveForm(req,res))


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Angel Jose Castro Ramirez CV' });
});

module.exports = router;