const fetch = require('node-fetch');
const RiveScript = require('rivescript');

class BotService{  
  constructor(data){
    this.url = data.url; // probably localhost
    this.port = data.port; // probably 3002
  }

  async getAllBots(){ //requête GET pour récupérer tous les bots du server 3001
    let returnValue = new Array();
    let myInit = { 
      method: 'GET',
      mode: 'cors',
      cache: 'default' 
    };
    let myURL = `http://localhost:3001/bot`;
    try {
      const response = await fetch(myURL,myInit);
      const setOfBots = await response.json();
      for (let i=0; i<setOfBots.length; i++){
          returnValue.push({'botId': (setOfBots[i]).id, 'botName': (setOfBots[i]).name, 'botMouth':(setOfBots[i]).mouth, 'botBrain': (setOfBots[i]).brain, 'botRivescript':null, 'botStatus': (setOfBots[i]).status});
      }
      
    } catch (error) {
      console.log(error);
    }
    console.log("type de données array");
    console.log(returnValue);
    return returnValue;
  }

  async getBotById(botId){ //requête GET pour obtenir un bot identifié par son id
    let returnValue = new BotIdentifier({'botId':id});
    let myInit = { 
      method: 'GET',
      mode: 'cors',
      cache: 'default' 
    };
    let myURL = `http://localhost:3001/bot/${id}`;
    try {
      const response = await fetch(myURL,myInit);
      const setOfBots = await response.json();
      returnValue.botName = (setOfBots.name);
      
    } catch (error) {
      console.log(error);
    }
    //console.log(returnValue);
    return returnValue;
  }
}

class BotIdentifier{ //structure d'un bot dans le serveur des brains
  static botId = this.botId; //the id of the Bot in the micro-service
  // TODO : when multiple sources of Bots is used : should differentiate botId and a localbotId...
  constructor(data){ // TODO : Should check if sourceId is known and valid
      this.botId = data.botId;
      this.botName = data.botName;
      this.botMouth = data.botMouth;
      this.botBrain = data.botBrain;
      this.botRivescript = data.botRivescript;
      this.botStatus = data.botStatus;
  }
  static isBotIdentifier(anObject){
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
    return hasMandatoryProperties;
  }
}


module.exports = {BotIdentifier, BotService};