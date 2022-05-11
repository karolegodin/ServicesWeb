import {Bot} from "./Bot.mjs";
import RiveScript from 'rivescript';

class BotService{
	constructor(data){ 
		this.array = new Array();
		this.db = {};
	}

	static async create(){ 
		return new BotService();
	}

	async addBot(anObject){
		console.log("J'ajoute un bot avec addBot");
		let newBot;
		try{
  			newBot = new Bot(anObject);
			//newBot.botRivescript = new RiveScript();
			//console.log("Création d'un nouveau rivescript");
			//let username = "local-user";
			//this.array.push(newBot);
		}catch(err){
			throw err; //throwing an error inside a Promise
		}
		this.array.push(newBot);
		console.log(`added bot of id ${newBot.id}, named ${newBot.name}`);
		return `added bot of id ${newBot.id}`;
	}

	//from PUT
	async replaceBot(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the given Object is a Task
			if(Bot.isBot(anObject)){
				/// Just replace it already!
				this.array.splice(index,1,anObject);
				return "Done REPLACING";
			}
			throw new Error(`given object is not a Bot : ${anObject}`);
		}
		throw new Error(`cannot find bot of id ${id}`);
	}

	//from PATCH
	async updateBot(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the fields of the given Object are from a Bot
			for(let property in anObject){
				if(!Bot.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Bot property : ${anObject}`);	
				}
			}
			//At this point, we are sure that all properties are valid and that we can make the update.
			for(let property in anObject){
				(this.array)[index][property] = anObject[property];
			}
			return "Done UPDATING";
		}
		throw new Error(`cannot find bot of id ${id}`);
	}

	async removeBot(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.array.splice(index,1);
			return `removed bot of id ${id}`;
		}
		throw new Error(`cannot find bot of id ${id}`);
		
	}

	getBot(id){
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			return  (this.array)[index];
		}
		throw new Error(`cannot find bot of id ${id}`);	
	}

	getBots(){
		return this.array;
	}

}

export {BotService}