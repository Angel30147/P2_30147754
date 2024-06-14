var express = require('express');
var router = express.Router();

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const ContactosController = require('./controllers/ContactosController');
const Auth = require('./controllers/Auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const controllerFacade = new ContactosController();

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUBCLIENT,
  clientSecret: process.env.GITHUBID,
  callbackURL: "https://curriculum-cv.onrender.com/github/callback",
  scope: 'user:email',
},
  function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));


router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {

    const id = process.env.ID;
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET);
    res.cookie("jwt", token);
    res.redirect('/contactos')
  });


router.post('/sendForm', (req, res, next) => controllerFacade.saveForm(req, res))

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Angel Jose Castro Ramirez CV', publicKey: process.env.PUBLICKEY });
});

router.post('/login', async (req, res, next) => {

  const { email, contraseña } = req.body;
  if (email == process.env.USER && contraseña == process.env.PASS) {
    const id = process.env.ID;
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET);
    res.cookie("jwt", token);
    res.redirect('/contactos')
  } else {
    res.status(200).json({ message: 'No autorizado!' });
  }
})


router.get('/login', Auth.protectRouteLogOut, (req,res,next) => {
  res.render('login')
})


router.get('/logout', (req, res, next) => {
  Auth.logout(req, res);
})

router.get('/contactos', Auth.protectRoute,async (req,res) => {
  const contactos = await controllerFacade.modeloFacade.obtenerContactos();
  res.render('contactos',{
    data:contactos
  })
})

module.exports = router;
