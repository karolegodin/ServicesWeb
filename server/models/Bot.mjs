import fetch from 'node-fetch';
import RiveScript from 'rivescript';

class Bot{  

    static id = this.id;
    static name = this.name; 
    static botRivescript = this.botRivescript;

  constructor(data){
    this.url = data.url; // probably localhost
    this.port = data.port; // probably 3001

    if(undefined != data.id) { 
        if(!isInt(data.id)){
          throw new Error("Bot Creation : passed Id is not an integer");
        }
        this.id = data.id;
      } else {
        this.id = parseInt(    Math.floor(Math.random() * Math.floor(100000))     );
      }

      if(undefined != data.name) {
        if(!isString(data.name)){
          throw new Error("Bot Creation : passed Title is not a string");
        }
        this.name = data.name;
      } else {
        this.name = "";
      }

    this.botRivescript = new RiveScript({debug: true});
    //let username = "local-user";
    console.log("Création nouveau rivescript");
  }

  static isBot(anObject){
    // check if mandatory fields are there
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
    // we should also check the property values (if are strings, etc ... as in constructor) 
    return hasMandatoryProperties;
  }

  static isValidProperty(propertyName,propertyValue) {
    if(!this.hasOwnProperty(propertyName)){
      return false;
    }
    // we should also check the property values (if are strings, etc ... as in constructor) 
    return true;
  }

  async getBotById(botId){
    // dummy Value
    let id = Math.floor(Math.random() * Math.floor(100000)) ;
    let returnValue = new Bot({'botId':id});
    //
    return returnValue;
  }


  async getAllBots(){
    let returnValue = new Array();
    let myInit = { 
      method: 'GET',
      mode: 'cors',
      cache: 'default' 
    };
    let myURL = `${this.url}:${this.port}`;
    try {
      const response = await fetch(myURL,myInit);
      const setOfBots = await response.json();
      for(let bot of setOfBots){
          returnValue.push(new BotIdentifier({'botId':bot.id,'botName':bot.name} ));
          
      }
      
    } catch (error) {
      console.log(error);
    }
    return returnValue;
  }

  async getBotById(botId){
    // dummy Value
    let id = Math.floor(Math.random() * Math.floor(100000)) ;
    let returnValue = new BotIdentifier({'botId':id});
    //
    return returnValue;
  }

  /*async loading_done(bot) {
    console.log("Bot has finished loading!");

    // Now the replies must be sorted!
    bot.sortReplies();

    // And now we're free to get a reply from the brain!

    // RiveScript remembers user data by their username and can tell
    // multiple users apart.
    //let username = "local-user";

    // NOTE: the API has changed in v2.0.0 and returns a Promise now.
    bot.reply(username, "Hello, bot!").then(function(reply) {
      console.log("The bot says: " + reply);
    });
    sendMessage("Coucou bande de nouilles");
  }

    // It's good to catch errors too!
    async loading_error(error, filename, lineno) {
      console.log("Error when loading files: " + error);
  }

    async sendMessage (text,bot) {
      console.log("You say: " + text);
      //$("#message").val("");
      //$("#dialogue").append("<div><span class='user'>You:</span> " + text + "</div>");
      bot.sortReplies();
      bot.reply(username,text).then(function(reply) {
        console.log("The bot says: " + reply);
      });
      /*bot.reply(username, text, this).then(function(reply) {
        reply = reply.replace(/\n/g, "<br>");*/
        
        //$("#dialogue").append("<div><span class='bot'>Bot:</span> " + reply + "</div>");
        //$("#dialogue").animate({ scrollTop: $("#dialogue").height() }, 1000);
      /*}).catch(function(e) {
        console.log(e.message + "\n" + e.line);*/
      //return false;
    //}

}

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function isString(myVar) {
  return (typeof myVar === 'string' || myVar instanceof String) ;
}

class BotIdentifier{
    static botId = this.botId; //the id of the Person in the micro-service
    // TODO : when multiple sources of Persons is used : should differentiate personId and a localPersonId...
    constructor(data){ // TODO : Should check if sourceId is known and valid
        this.botId = data.botId
    }
    static isBotIdentifier(anObject){
      // check if mandatory fields are there
      let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
      // TODO : we should also check the property values (if are strings, etc ... as in constructor) 
      return hasMandatoryProperties;
    }
  }
export {Bot, BotIdentifier}