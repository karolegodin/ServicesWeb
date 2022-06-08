const fetch = require('node-fetch');

class MouthService{  
  constructor(data){
    this.url = data.url; // probably localhost
    this.port = data.port; // probably 3002
  }

  async getAllMouths(){ //obtenir toutes les mouth de mouthServer par une requête GET
    let returnValue = new Array();
    let myInit = { 
      method: 'GET',
      mode: 'cors',
      cache: 'default' 
    };
    let myURL = `http://localhost:3002/mouth`;
    try {
      const response = await fetch(myURL,myInit);
      const setOfMouths = await response.json();
      //console.warn(xhr.responseText);
      for(let mouth of setOfMouths){
          console.log(mouth);
          returnValue.push(new MouthIdentifier({'mouthId':mouth.id, 'mouthName':mouth.name}));
      }
      
    } catch (error) {
      console.log(error);
    }
    //console.log(returnValue);
    return returnValue;
  }
}

class MouthIdentifier{ //structure d'une mouth dans le serveur des bots
  static mouthId = this.mouthId; //the id of the Mouth in the micro-service
  static mouthName = this.mouthName;
  constructor(data){ 
      this.mouthId = data.mouthId
      this.mouth = data.mouthName
  }
  static isMouthIdentifier(anObject){
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
    return hasMandatoryProperties;
  }
}

module.exports = {MouthIdentifier, MouthService};