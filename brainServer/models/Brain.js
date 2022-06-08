const fetch = require('node-fetch');

class Brain{  

    static id = this.id;
    static name = this.name;

  constructor(data){

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

  static isBrain(anObject){//vérifie si 'anObject' est bien un cerveau
    let hasMandatoryProperties = Object.keys(this).every(key=> anObject.hasOwnProperty(key)); 
    return hasMandatoryProperties;
  }

  static isValidProperty(propertyName,propertyValue) {//vérifie si 'propertyName' est bien une propriété valide d'un cerveau
    if(!this.hasOwnProperty(propertyName)){
      return false;
    }
    return true;
  }

}

function isInt(value) {//vérifie si 'value' est bien un entier
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function isString(myVar) {//vérifie si 'myVar' est bien une chaîne de caractères
  return (typeof myVar === 'string' || myVar instanceof String) ;
}

//permet d'utiliser 'Brain' dans d'autres fichiers
module.exports = {Brain};