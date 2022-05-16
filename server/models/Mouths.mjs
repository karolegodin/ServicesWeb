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
  static mouthName = this.mouthName;
  // TODO : when multiple sources of Mouths is used : should differentiate mouthId and a localMouthId...
  constructor(data){ // TODO : Should check if sourceId is known and valid
      this.mouthId = data.mouthId
      this.mouth = data.mouthName
  }
  static isMouthIdentifier(anObject){
    // check if mandatory fields are there
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
    // TODO : we should also check the property values (if are strings, etc ... as in constructor) 
    return hasMandatoryProperties;
  }
}



export {MouthIdentifier, MouthService}