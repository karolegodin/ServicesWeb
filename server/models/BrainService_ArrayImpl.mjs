import {Brain} from "./Brain.mjs";

class BrainService{
	constructor(data){ 
		this.array = new Array();
		this.db = {};
	}

	static async create(){ 
		return new BrainService();
	}

	async addBrain(anObject){
		let newBrain;
		try{
  			newBrain = new Brain(anObject);
		}catch(err){
			throw err; //throwing an error inside a Promise
		}
		this.array.push(newBrain);
		return `added brain of id ${newBrain.id}`;
	}

	//from PUT
	async replaceBrain(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the given Object is a Task
			if(Brain.isBrain(anObject)){
				/// Just replace it already!
				this.array.splice(index,1,anObject);
				return "Done REPLACING";
			}
			throw new Error(`given object is not a Brain : ${anObject}`);
		}
		throw new Error(`cannot find brain of id ${id}`);
	}

	//from PATCH
	async updateBrain(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the fields of the given Object are from a Bot
			for(let property in anObject){
				if(!Brain.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Brain property : ${anObject}`);	
				}
			}
			//At this point, we are sure that all properties are valid and that we can make the update.
			for(let property in anObject){
				(this.array)[index][property] = anObject[property];
			}
			return "Done UPDATING";
		}
		throw new Error(`cannot find brain of id ${id}`);
	}

	async removeBrain(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.array.splice(index,1);
			return `removed brain of id ${id}`;
		}
		throw new Error(`cannot find brain of id ${id}`);
		
	}

	getBrain(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			return  (this.array)[index];
		}
		throw new Error(`cannot find brain of id ${id}`);	
	}

	getBrains(){
		return this.array;
	}

}

export {BrainService}