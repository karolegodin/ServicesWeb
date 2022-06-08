const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const http = require("http");
const {Server} = require("socket.io");
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware.js');

const app = express();
const RiveScript = require('rivescript');

const {BotService} = require('./models/BotService_ArrayImpl.js');
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});

const {MouthIdentifier,MouthService} = require ('./models/Mouths.js');
let mouthServiceInstance;
let mouthServiceAccessPoint = new MouthService({url:"http://localhost",port:3002});

//// Enable ALL CORS request
app.use(cors())
////

const port = 3001 //port du serveur de bots
const port2 = 3000 //port de MongoDB

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(express.static('views'))
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://webserviceproject:YjWds5PxDPBsDEA@cluster0.leyyy.mongodb.net/auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(port2))
  .catch((err) => console.log(err));

//instanciation des trois bots

let id = 0 ; 
let firstBot ={ 
	'id':3011,
	'name':'Steeve'
};
let secondBot ={ 
	'id':3012,
	'name':'Aiden'
};
let thirdBot ={ 
	'id':3013,
	'name':'Tom'
};

//lancement du serveur de bots
BotService.create(botServiceAccessPoint).then(bs=>{
	botServiceInstance=bs;
	botServiceInstance
		.addBot(firstBot)
		.catch((err)=>{console.log(err);});
	botServiceInstance
		.addBot(secondBot)
		.catch((err)=>{console.log(err);});
	botServiceInstance
		.addBot(thirdBot)
		.catch((err)=>{console.log(err);});
	app.listen(port, () => {
		console.log(firstBot.id, firstBot.name)
		console.log(secondBot.id, secondBot.name)
		console.log(thirdBot.id, thirdBot.name)
  		console.log(`Bot server listening at http://localhost:${port}`)
	});
});

app.get('*', checkUser);

//Page d'accueil du site
app.get('/', (req, res)=>{
	try{
		res.render('index')

	}
	catch(err){
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});

//Page pour sélectionner le bot et la mouth
app.get('/createBot', requireAuth, (req, res)=>{
	try{
		res.render('createBot')

	}
	catch(err){
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});

//affichage de la liste de mouths en format JSON
app.get('/mouth', async(req,res)=>{
	let mouthsArray = await getAllMouths();
	res.status(200).json(mouthsArray);
})

//affichage de la liste de bots au format JSON
app.get('/bot', async(req,res)=>{
	try{
		let myArrayOfBots;
		if( undefined == (myArrayOfBots = await botServiceInstance.getBots() )){
			throw new Error("No bots to get");
		}
		res.status(200).json(myArrayOfBots);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
})

//affichage de la liste des bots 
app.get('/botV2', requireAuth, async(req,res)=>{
	try{
			res.render('botList')
	
		}
		catch(err){
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
})

//affichage d'un bot au format JSON
app.get('/bot/:idddd', (req, res)=>{
	let id = req.params.idddd;
	if(!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		try{
			let myBot = botServiceInstance.getBot(id);
			res.status(200).json([{'id':myBot.id,'name':myBot.name,'mouth':myBot.mouth,'brain':myBot.brain, 'status':myBot.status}]);
		}
		catch(err){
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
	}
});

//affichage des informations de Steeve
app.get('/botV2/3011', requireAuth, (req, res)=>{
	if(!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		try{
			res.render('steeve')
		}
		catch(err){
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
	}
});

//affichage des informations de Aiden
app.get('/botV2/3012', requireAuth, (req, res)=>{
	if(!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		try{
			res.render('aiden')
		}
		catch(err){
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
	}
});

//afficgahe des informations de Tom
app.get('/botV2/3013', requireAuth, (req, res)=>{
	if(!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		try{
			res.render('tom')
		}
		catch(err){
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
	}
});

//affichage de la liste des mouths
app.get('/mouthV2', requireAuth, async (req, res) => {
	try {
		res.render('mouthList')

	}
	catch (err) {
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});

//affichage de la liste des brains
app.get('/brainV2', requireAuth, async(req,res)=>{
	try{
			res.render('brainList')

		}
		catch(err){
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
})


app.get('/login', (req, res)=>{
	try{
			res.render('login')
	
		}
		catch(err){
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
});

//page pour ajouter un brain avec une requête PATCH
app.patch('/bot/:id', (req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		console.log("Valeurs à update");
		console.log(newValues.brain);
		botServiceInstance
			.updateBot(id, newValues)
			.then((returnString)=>{
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err)=>{
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST');
			});	
	}	
});

//page pour supprimer un brain avec une requête PATCH
app.patch('/bot/remove/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		console.log("Valeurs à supprimer");
		console.log(newValues.brain);
		botServiceInstance
			.removeProperty(id, newValues)
			.then((returnString)=>{
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err)=>{
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST');
			});	
	}	
});

//page pour actualiser le statut d'un bot par une requête PATCH
app.patch('/bot/status/:id',(req,res)=>{
	let id = req.params.id;
	if(!isInt(id)) { //Should I propagate a bad parameter to the model?
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		let newValues = req.body; //the client is responsible for formating its request with proper syntax.
		console.log("Statut à modifier");
		console.log(newValues.brain);
		botServiceInstance
			.updateBot2(id, newValues)
			.then((returnString)=>{
				console.log(returnString);
				res.status(201).send('All is OK');
			})
			.catch((err)=>{
				console.log(`Error ${err} thrown... stack is : ${err.stack}`);
				res.status(400).send('BAD REQUEST');
			});	
	}	
});

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

async function getAllMouths(){
	return await mouthServiceAccessPoint.getAllMouths();
}

async function getBots(){
	console.log(botServiceAccessPoint);
	return botServiceAccessPoint.getBots();
}

app.use(authRoutes);