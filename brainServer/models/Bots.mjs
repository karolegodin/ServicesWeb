import fetch from 'node-fetch';
import RiveScript from 'rivescript';

class BotService{  
  constructor(data){
    this.url = data.url; // probably localhost
    this.port = data.port; // probably 3002
  }

  async getAllBots(){
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
      /*for(let bot of setOfBots){
          //console.log(bot);
          returnValue.push(new BotIdentifier({'botId':bot.id, 'botName':bot.name}));
          
      }*/
      for (let i=0; i<setOfBots.length; i++){
          //console.log(setOfBots);
          returnValue.push({'botId': (setOfBots[i]).id, 'botName': (setOfBots[i]).name, 'botMouth':(setOfBots[i]).mouth, 'botBrain': (setOfBots[i]).brain, 'botRivescript':null});
          //console.log(returnValue);
          //returnValue.push({'botRivescript': (setOfBots[i]).botRivescript});
      }
      
    } catch (error) {
      console.log(error);
    }
    //console.log("Je sors de la requête GET");
    //console.log(returnValue);
    console.log("type de données array");
    console.log(returnValue);
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



class BotIdentifier{
  static botId = this.botId; //the id of the Bot in the micro-service
  static botName = this.botName;
  // TODO : when multiple sources of Bots is used : should differentiate botId and a localbotId...
  constructor(data){ // TODO : Should check if sourceId is known and valid
      this.botId = data.botId;
      this.botName = data.botName;
      this.botMouth = data.botMouth;
      this.botBrain = data.botBrain;
      this.botRivescript = data.botRivescript;
  }
  static isBotIdentifier(anObject){
    // check if mandatory fields are there
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
    // TODO : we should also check the property values (if are strings, etc ... as in constructor) 
    return hasMandatoryProperties;
  }
}



export {BotIdentifier, BotService}