const jwt = require('jsonwebtoken');
const User = require('../models/User');

//oblige les utilisateurs à s'authentifier pour accéder à une page du client
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //vérifie si le json web token existe et est valide
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

//vérifie l'authentification de l'utilisateur
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

//permet d'utiliser les classes dans d'autres fichiers
module.exports = { requireAuth, checkUser };