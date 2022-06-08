const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

//création d'un nouveau schéma dans la collection utilisée
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  }
});

//lance la fonction avant sauvegarde du document dans la database
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();//création d'un sel pour le mot de passe
  this.password = await bcrypt.hash(this.password, salt);//hashage du mot de passe et ajout du sel
  next();
});

//méthode statique pour l'authentification d'un utilisateur
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });//recherche de l'utilisateur dans la database
  if (user) {
    //comparaison des mots de passe stockés à celui entré en paramètre
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

//utilisation du schéma 'user' dans mongodb
const User = mongoose.model('user', userSchema);

//permet d'utiliser la classe dans d'autres fichiers
module.exports = User;