const { name } = require('ejs');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log("asasasd")

  res.render('index', {
    title: 'Hola Mundo',
    name: 'Angel Jose',
    lastname: 'Castro Ramirez',
    dni: '30.147.754',
    section: '2',
  });
});

module.exports = router;
