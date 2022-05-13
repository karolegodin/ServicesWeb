import fetch from 'node-fetch';

class MouthService{  
  constructor(data){
    this.url = data.url; // probably localhost
    this.port = data.port; // probably 3002
  }

  async getAllMouths(){
    let returnValue = new Array();
    let myInit = { 
      method: 'GET',
      mode: 'cors',
      cache: 'default' 
    };
    let myURL = `${this.url}:${this.port}`;
    try {
      const response = await fetch(myURL,myInit);
      const setOfMouths = await response.json();
      for(let mouth of setOfMouths){
          returnValue.push(new MouthIdentifier({'mouthId':mouth.id,'mouthLogin':mouth.login} ));
          
      }
      
    } catch (error) {
      console.log(error);
    }
    return returnValue;
  }

  async getMouthById(mouthId){
    // dummy Value
    let id = Math.floor(Math.random() * Math.floor(100000)) ;
    let returnValue = new MouthIdentifier({'mouthId':id});
    //
    return returnValue;
  }

}



class MouthIdentifier{
  static mouthId = this.mouthId; //the id of the Mouth in the micro-service
  // TODO : when multiple sources of Mouths is used : should differentiate mouthId and a localMouthId...
  constructor(data){ // TODO : Should check if sourceId is known and valid
      this.mouthId = data.mouthId
  }
  static isMouthIdentifier(anObject){
    // check if mandatory fields are there
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
    // TODO : we should also check the property values (if are strings, etc ... as in constructor) 
    return hasMandatoryProperties;
  }
}



export {MouthIdentifier, MouthService}