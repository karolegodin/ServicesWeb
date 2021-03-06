const fetch = require('node-fetch');
const RiveScript = require('rivescript');
const { MouthIdentifier } = require('./Mouths.js');

class Bot {

  static id = this.id;
  static name = this.name;
  static botRivescript = this.botRivescript;
  static mouth = this.mouth;
  static brain = this.brain;
  static status = this.status;

  constructor(data) {

    if (undefined != data.id) {
      console.log(data.id);
      if (!isInt(data.id)) {
        throw new Error("Bot Creation : passed Id is not an integer");
      }
      this.id = data.id;
    } else {
      console.log("id mauvaise");
      this.id = parseInt(Math.floor(Math.random() * Math.floor(100000)));
    }

    if (undefined != data.name) {
      if (!isString(data.name)) {
        throw new Error("Bot Creation : passed Title is not a string");
      }
      this.name = data.name;
    } else {
      console.log("mauvais nom");
      this.name = "";
    }

    if (undefined == data.mouth) {
      this.mouth = "";
    }

    if (undefined == data.status) {
      this.status = "offline";
    }

    //instanciation du bot
    this.botCreation();
  }

  async botCreation() { //instanciation et création d'un bot Rivescript
    this.botRivescript = new RiveScript();
    let username = "local-user";
    this.botRivescript.loadFile("./../brainServer/pathtobrain/standard.rive").then(() => this.loading_done()).catch(this.loading_error);
    this.brain = new Array();
    this.brain.push("Standard");

  }
  static isBot(anObject) {//vérifie si 'anObject' est bien de type Bot
    let hasMandatoryProperties = Object.keys(this).every(key => anObject.hasOwnProperty(key));
    return hasMandatoryProperties;
  }

  static isValidProperty(propertyName, propertyValue) {//vérifie si 'propertyName' est valide pour le bot
    if (!this.hasOwnProperty(propertyName)) {
      return false;
    }
    return true;
  }

  //chargement d'un bot Rivescript
  async loading_done() {
    console.log("Bot has finished loading!");
    this.botRivescript.sortReplies();
    let username = "local-user";
  }

  //en cas d'erreur de chargement
  async loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
  }

  //envoyer un message au bot Rivescript
  async sendMessage(text, username) {
    console.log("You say: " + text);
    this.botRivescript.sortReplies();
    this.botRivescript.reply(username, text).then(function (reply) {
      console.log("The bot says: " + reply);
    });
  }

}

function isInt(value) {//vérifie si 'value' est de type entier
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function isString(myVar) {//vérifie si 'myVar' est une chaîne de caractères
  return (typeof myVar === 'string' || myVar instanceof String);
}

//permet d'utiliser les classes dans d'autres fichiers
module.exports = { Bot };
