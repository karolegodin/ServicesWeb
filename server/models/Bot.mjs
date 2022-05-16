import fetch from 'node-fetch';
import RiveScript from 'rivescript';
import {MouthIdentifier} from "./Mouths.mjs";

class Bot{  

    static id = this.id;
    static name = this.name; 
    static botRivescript = this.botRivescript;
    static mouth = this.mouth;
    static brain = this.brain;

  constructor(data){
    //this.url = data.url; // probably localhost
    //this.port = data.port; // probably 3001


    if(undefined != data.id) { 
        console.log(data.id);
        if(!isInt(data.id)){
          throw new Error("Bot Creation : passed Id is not an integer");
        }
        this.id = data.id;
      } else {
        console.log("id mauvaise");
        this.id = parseInt(    Math.floor(Math.random() * Math.floor(100000))     );
      }

      if(undefined != data.name) {
        if(!isString(data.name)){
          throw new Error("Bot Creation : passed Title is not a string");
        }
        this.name = data.name;
      } else {
        console.log("mauvais nom");
        this.name = "";
      }

      if(undefined == data.mouth){
        this.mouth = "";
      }

      /*if(undefined != data.assignement) {
        if(!MouthIdentifier.isMouthIdentifier(data.assignement)){
          throw new Error("Bot Creation : passed assignement is not a Mouth identifier");
        }
        this.assignement = data.assignement;
      } else {
        // dummy Value
        let id = Math.floor(Math.random() * Math.floor(100000)) ;
        let sourceId = Math.floor(Math.random() * Math.floor(100000)) ;
        let returnValue = new MouthIdentifier({'id':id,'sourceId':sourceId,'mouthId':1});
        //
        this.assignement = returnValue;
      }*/
      //this.botRivescript = "";
      this.botCreation();
  }

  async botCreation(){
    this.botRivescript = new RiveScript();
    let username = "local-user";
    this.botRivescript.loadFile("./pathtobrain/standard.rive").then(()=> this.loading_done()).catch(this.loading_error);
    this.brain = new Array();
    this.brain.push("Standard");
    //console.log("Création nouveau rivescript avec botCreation");

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


  async loading_done() {
    console.log("Bot has finished loading!");
    //console.log(this.botRivescript);
    // Now the replies must be sorted!
    this.botRivescript.sortReplies();

    // And now we're free to get a reply from the brain!

    // RiveScript remembers user data by their username and can tell
    // multiple users apart.
    let username = "local-user";

    // NOTE: the API has changed in v2.0.0 and returns a Promise now.
    console.log("You say : Hello, bot!");
    this.botRivescript.reply(username, "Hello, bot!").then(function(reply) {
      console.log("The bot says: " + reply);
    });
    this.sendMessage("What is your name",username);
  }

    // It's good to catch errors too!
    async loading_error(error, filename, lineno) {
      console.log("Error when loading files: " + error);
  }

    async sendMessage (text,username) {
      console.log("You say: " + text);
      //$("#message").val("");
      //$("#dialogue").append("<div><span class='user'>You:</span> " + text + "</div>");
      this.botRivescript.sortReplies();
      this.botRivescript.reply(username,text).then(function(reply) {
        console.log("The bot says: " + reply);
      });
      /*bot.reply(username, text, this).then(function(reply) {
        reply = reply.replace(/\n/g, "<br>");*/
        
        //$("#dialogue").append("<div><span class='bot'>Bot:</span> " + reply + "</div>");
        //$("#dialogue").animate({ scrollTop: $("#dialogue").height() }, 1000);
      /*}).catch(function(e) {
        console.log(e.message + "\n" + e.line);*/
      //return false;
    }

}

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function isString(myVar) {
  return (typeof myVar === 'string' || myVar instanceof String) ;
}

export {Bot}
