import fetch from 'node-fetch';

class Mouth{  

    static id = this.id;
    static name = this.name; 

  constructor(data){
    this.url = data.url; // probably localhost
    this.port = data.port; // probably 3001

    if(undefined != data.id) { 
        if(!isInt(data.id)){
          throw new Error("Mouth Creation : passed Id is not an integer");
        }
        this.id = data.id;
      } else {
        this.id = parseInt(    Math.floor(Math.random() * Math.floor(100000))     );
      }

      if(undefined != data.name) {
        if(!isString(data.name)){
          throw new Error("Mouth Creation : passed Title is not a string");
        }
        this.name = data.name;
      } else {
        this.name = "";
      }
  }

  static isMouth(anObject){
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

  async getMouthById(brainId){
    // dummy Value
    let id = Math.floor(Math.random() * Math.floor(100000)) ;
    let returnValue = new Mouth({'mouthId':id});
    //
    return returnValue;
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
          returnValue.push(new MouthIdentifier({'mouthId':mouth.id,'mouthName':mouth.name} ));
          
      }
      
    } catch (error) {
      console.log(error);
    }
    return returnValue;
  }

  async getMouthById(brainId){
    // dummy Value
    let id = Math.floor(Math.random() * Math.floor(100000)) ;
    let returnValue = new MouthIdentifier({'mouthId':id});
    //
    return returnValue;
  }

}

class MouthIdentifier{
    static mouthId = this.mouthId; //the id of the Person in the micro-service
    // TODO : when multiple sources of Persons is used : should differentiate personId and a localPersonId...
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
export {Mouth, MouthIdentifier}