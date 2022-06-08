const {Mouth} = require("./Mouth.js");

class MouthService{
	constructor(data){ 
		this.array = new Array();
		this.db = {};
	}

	static async create(){ //création d'une nouvelle instance de MouthService
		return new MouthService();
	}

	async addMouth(anObject){ //ajouter une mouth dans le serveur des mouths
		let newMouth;
		try{
  			newMouth = new Mouth(anObject);
		}catch(err){
			throw err; //throw une erreur dans une promesse
		}
		this.array.push(newMouth);
		return `added mouth of id ${newMouth.id},named ${newMouth.name}`;
	}

	//from PUT
	async replaceMouth(id, anObject){ 
		let index = this.array.findIndex(e=> e.id == id);	
		if(index >-1 ){
			if(Mouth.isMouth(anObject)){
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
			for(let property in anObject){
				if(!Mouth.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Mouth property : ${anObject}`);	
				}
			}
			//ici, nous sommes sûrs que toutes les propriétés sont valides et que l'on peut effectuer la modification
			for(let property in anObject){
				(this.array)[index][property] = anObject[property];
			}
			return "Done UPDATING";
		}
		throw new Error(`cannot find mouth of id ${id}`);
	}

	async removeMouth(id){//supprime la bouche d'identifiant 'id' du tableau des bouches
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.array.splice(index,1);
			return `removed mouth of id ${id}`;
		}
		throw new Error(`cannot find mouth of id ${id}`);
		
	}

	getMouth(id){//Retourne la bouche d'identifiant 'id'
		let index = this.array.findIndex(e=> e.id == id);
		if(index >-1 ){
			return  (this.array)[index];
		}
		throw new Error(`cannot find mouth of id ${id}`);	
	}

	getMouths(){//retourne le tableau des bouches
		return this.array;
	}

}

//permet d'utiliser MouthService dans les autres fichiers
module.exports = {MouthService};