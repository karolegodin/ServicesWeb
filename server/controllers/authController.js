const User = require("../models/User");
const jwt = require('jsonwebtoken');

//manage les erreurs sur l'authentification
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // email incorrect
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // mot de passe incorrect
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // identifiants incorrect, la connexion de l'utilisateur a échoué
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// crée un json web token
const maxAge = 3 * 24 * 60 * 60;//durée avant expiration du json web token en millisecondes
const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};

//actions du controlleur

//affiche la page d'authentification via une requête de type 'GET'
module.exports.login_get = (req, res) => {
  res.render('login');
}

//envoi de la demande d'authentification via une requête de type 'POST'
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

//expiration du cookie, déconnexion de l'utilisateur et redirection vers la page d'accueil
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}