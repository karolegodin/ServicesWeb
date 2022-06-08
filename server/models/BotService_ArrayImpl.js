const {Bot} = require('./Bot.js');
const {parse, stringify} = require('flatted');
const RiveScript = require('rivescript');

class BotService{
	constructor(data){ 
		this.array = new Array();
		this.db = {};
	}

	static async create(){//création d'une nouvelle instance de BotService
		return new BotService();
	}

	async addBot(anObject){ //ajouter un bot dans le tableau de bots
		let newBot;
		try{
  			newBot = new Bot(anObject);
		}catch(err){
			throw err;
		}
		this.array.push(newBot);
		console.log(`added bot of id ${newBot.id}, named ${newBot.name}`);
		this.getBots;
		return `added bot of id ${newBot.id},  named ${newBot.name}`;
	}

	//from PUT
	async replaceBot(id, anObject){
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			if(Bot.isBot(anObject)){
				this.array.splice(index,1,anObject);
				return "Done REPLACING";
			}
			throw new Error(`given object is not a Bot : ${anObject}`);
		}
		throw new Error(`cannot find bot of id ${id}`);
	}

	//from PATCH
	async updateBot(id, anObject){ //ajouter un nouveau brain au bot
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			for(let property in anObject){
				if(!Bot.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Bot property : ${anObject}`);	
				}
			}
			for(let property in anObject){
				(this.array)[index][property].push(anObject[property]);
			}
			return "Done UPDATING";
		}
		throw new Error(`cannot find bot of id ${id}`);
	}

	async updateBot2(id, anObject){ //patch le statut du bot : online ou offline
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			for(let property in anObject){
				if(!Bot.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Bot property : ${anObject}`);	
				}
			}
			for(let property in anObject){
				(this.array)[index][property]=(anObject[property]);
			}
			return "Done UPDATING";
		}
		throw new Error(`cannot find bot of id ${id}`);
	}

	async removeProperty(id, anObject){ //utilisé pour supprimer un brain du bot
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			let property;
			for(property in anObject){
				if(!Bot.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Bot property : ${anObject}`);	
				}
			}
		let index2 = this.array.findIndex(e=> e[property] == index[property]);
			for(property in anObject){
				//console.log(anObject);
				(this.array)[index][property].splice(index2,1);
				//console.log((this.array)[index]);
			}
			return "Done REMOVING BRAIN";
		}
		throw new Error(`cannot find bot of id ${id}`);
	}

	async removeBot(id){//supprime le bot d'identifiant 'id' du tableau des Bots
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.array.splice(index,1);
			return `removed bot of id ${id}`;
		}
		throw new Error(`cannot find bot of id ${id}`);
		
	}

	getBot(id){ //obtenir un bot grâce à son identifiant
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			return  (this.array)[index];
		}
		throw new Error(`cannot find bot of id ${id}`);	
	}

	getBots(){ //obtenir le tableau de tous les bots
		let strArray = new Array();
		for (let i=0; i<this.array.length; i++){
			strArray.push({'name':(this.array[i]).name, 'id':(this.array[i]).id, 'mouth':(this.array[i]).mouth, 'brain':(this.array[i]).brain, 'status':(this.array[i]).status});
		} 
		return strArray;
	}

}

//permet d'utiliser les classes dans d'autres fichiers
module.exports = {BotService};