const fetch = require('node-fetch');
const RiveScript = require('rivescript');

class BotService{  
  constructor(data){
    this.url = data.url; // probably localhost
    this.port = data.port; // probably 3002
  }

  async getAllBots(){ //obtenir tous les bots du serveur de bots par une requête GET
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
      //console.warn(xhr.responseText);
      for (let i=0; i<setOfBots.length; i++){
          returnValue.push({'botId': (setOfBots[i]).id, 'botName': (setOfBots[i]).name, 'botMouth':(setOfBots[i]).mouth, 'botBrain': (setOfBots[i]).brain, 'botRivescript':null, 'botStatus': (setOfBots[i]).status});
      }
      
    } catch (error) {
      console.log(error);
    }
    //console.log(returnValue);
    return returnValue;
  }

  async getBotById(id){ //obtenir un bot du serveur de bots grâce à son identifiant
    let returnValue = new Array();
    let myInit = { 
      method: 'GET',
      mode: 'cors',
      cache: 'default' 
    };
    let myURL = `http://localhost:3001/bot/${id}`;
    try {
      const response = await fetch(myURL,myInit);
      const setOfBots = await response.json();
      //console.warn(xhr.responseText);
      for(let bot of setOfBots){
        returnValue.push(new BotIdentifier({'botId':bot.id, 'botName':bot.name, 'botMouth':bot.mouth, 'botBrain':bot.brain, 'botRivescript':null, 'botStatus':bot.status}));
      }
    } catch (error) {
      console.log(error);
    }
    //console.log(returnValue);
    return returnValue;
  }
}



class BotIdentifier{ //structure d'un bot dans le serveur des mouths
  static botId = this.botId; //the id of the Bot in the micro-service
  static botName = this.botName;
  constructor(data){ 
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