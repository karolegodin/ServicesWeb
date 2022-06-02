class Mouth{  

    static id = this.id;
    static name = this.name; 

  constructor(data){
    //this.url = data.url; // probably localhost
    //this.port = data.port; // probably 3002

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


}

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function isString(myVar) {
  return (typeof myVar === 'string' || myVar instanceof String) ;
}

module.exports = {Mouth};