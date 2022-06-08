const {Mouth} = require("./Mouth.js");

class MouthService{
	constructor(data){ 
		this.array = new Array();
		this.db = {};
	}

	static async create(){ 
		return new MouthService();
	}

	async addMouth(anObject){ //ajouter une mouth dans le serveur des mouths
		let newMouth;
		try{
  			newMouth = new Mouth(anObject);
		}catch(err){
			throw err; //throwing an error inside a Promise
		}
		this.array.push(newMouth);
		return `added mouth of id ${newMouth.id},named ${newMouth.name}`;
	}

	//from PUT
	async replaceMouth(id, anObject){ 
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the given Object is a Task
			if(Mouth.isMouth(anObject)){
				/// Just replace it already!
				this.array.splice(index,1,anObject);
				return "Done REPLACING";
			}
			throw new Error(`given object is not a Mouth : ${anObject}`);
		}
		throw new Error(`cannot find mouth of id ${id}`);
	}

	//from PATCH
	async updateMouth(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the fields of the given Object are from a Bot
			for(let property in anObject){
				if(!Mouth.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Mouth property : ${anObject}`);	
				}
			}
			//At this point, we are sure that all properties are valid and that we can make the update.
			for(let property in anObject){
				(this.array)[index][property] = anObject[property];
			}
			return "Done UPDATING";
		}
		throw new Error(`cannot find mouth of id ${id}`);
	}

	async removeMouth(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.array.splice(index,1);
			return `removed mouth of id ${id}`;
		}
		throw new Error(`cannot find mouth of id ${id}`);
		
	}

	getMouth(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			return  (this.array)[index];
		}
		throw new Error(`cannot find mouth of id ${id}`);	
	}

	getMouths(){
		return this.array;
	}

}

module.exports = {MouthService};