import fetch from 'node-fetch';

class Bot{  

    static id = this.id;
    static name = this.name; 

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