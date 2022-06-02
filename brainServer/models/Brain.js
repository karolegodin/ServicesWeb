const fetch = require('node-fetch');

class Brain{  

    static id = this.id;
    static name = this.name;
    //static rive = this.rive;

  constructor(data){
    //this.url = data.url; // probably localhost
    //this.port = data.port; // probably 3001

    if(undefined != data.id) { 
        if(!isInt(data.id)){
          throw new Error("Brain Creation : passed Id is not an integer");
        }
        this.id = data.id;
      } else {
        this.id = parseInt(    Math.floor(Math.random() * Math.floor(100000))     );
      }

      if(undefined != data.name) {
        if(!isString(data.name)){
          throw new Error("Brain Creation : passed Title is not a string");
        }
        this.name = data.name;
      } else {
        this.name = "";
      }
  }

  static isBrain(anObject){
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

  /*async getBrainById(brainId){
    // dummy Value
    let id = Math.floor(Math.random() * Math.floor(100000)) ;
    let returnValue = new Brain({'brainId':id});
    //
    return returnValue;
  }*/


  /*async getAllBrains(){
    let returnValue = new Array();
    let myInit = { 
      method: 'GET',
      mode: 'cors',
      cache: 'default' 
    };
    let myURL = `${this.url}:${this.port}`;
    try {
      const response = await fetch(myURL,myInit);
      const setOfBrains = await response.json();
      for(let brain of setOfBrains){
          returnValue.push(new BrainIdentifier({'brainId':brain.id,'brainName':brain.name} ));
          
      }
      
    } catch (error) {
      console.log(error);
    }
    return returnValue;
  }*/

  /*async getBrainById(brainId){
    // dummy Value
    let id = Math.floor(Math.random() * Math.floor(100000)) ;
    let returnValue = new BrainIdentifier({'brainId':id});
    //
    return returnValue;
  }*/

}

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function isString(myVar) {
  return (typeof myVar === 'string' || myVar instanceof String) ;
}

/*class BrainIdentifier{
    static brainId = this.brainId; //the id of the Person in the micro-service
    // TODO : when multiple sources of Persons is used : should differentiate personId and a localPersonId...
    constructor(data){ // TODO : Should check if sourceId is known and valid
        this.brainId = data.brainId
    }
    static isBrainIdentifier(anObject){
      // check if mandatory fields are there
      let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key));
      // TODO : we should also check the property values (if are strings, etc ... as in constructor) 
      return hasMandatoryProperties;
    }
  }*/
module.exports = {Brain};