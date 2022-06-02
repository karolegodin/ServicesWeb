import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import http from "http";
import {Server} from "socket.io";

const app = express();
import RiveScript from 'rivescript';

/*import {BotService} from "./models/BotService_ArrayImpl.mjs";
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});*/

/*import {BrainService} from "../brainServer/models/BrainService_ArrayImpl.mjs";
let brainServiceInstance;
let brainServiceAccessPoint = new BrainService({url:"http://localhost",port:3001});*/

import {MouthService} from "./models/MouthService_ArrayImpl.mjs";
import { Mouth } from './models/Mouth.mjs';
let mouthServiceInstance;
let mouthServiceAccessPoint = new MouthService({url:"http://localhost",port:3002});

import {BotIdentifier,BotService} from "./models/Bots.mjs";
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});
let botsArray;
//// Enable ALL CORS request
app.use(cors())
////

const port = 3002

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(express.static('./../client'))

//app.use(express.static('./../client'))

let firstMouth ={ 
	'id':1,
	'name':'Socket'
};

let secondMouth ={ 
	'id':2,
	'name':'Discord'
};

var bot = new RiveScript();
bot.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);
//bot.loadFile("./../brainServer/pathtobrain/client.rive").then(loading_done).catch(loading_error);

//let server;
//let io;
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
	console.log('a user connected');
	let username = "local-user";
	socket.on('chat message', (msg) => {
	  console.log('message: ' + msg);
	  bot.reply(username,msg).then(function(reply) {
		console.log("The bot says: " + reply);
		io.emit('chat message', msg);
		io.emit('chat message', reply);
	  });
  
	});
  });

/*io.on("connect_error", (err) => {
	console.log(`connect_error due to ${err.message}`);
  });*/
function createBot(id){
	let bot = getBotById(id); //bot existant dans la base de données
	//console.log("bot " +bot);
	/*bot.botRivescript = new RiveScript();
	console.log("Rivescript créé");
	//console.log(bot.botRivescript);
	bot.botRivescript.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);
	return bot.botRivescript*/
}

/*function socketConnection(id){
	let rive = createBot(id);
	//server = http.createServer(app);
	//io = new Server(server);
	io.on('connection', (socket) => {
		console.log('a user connected');
		let username = "local-user";
		socket.on('chat message', (msg) => {
		console.log('message: ' + msg);
		rive.reply(username,msg).then(function(reply) {
			console.log("The bot says: " + reply);
			io.emit('chat message', msg);
			io.emit('chat message', reply);
		});
  
	});
  });
}*/

MouthService.create(mouthServiceAccessPoint).then(ms=>{
	mouthServiceInstance=ms;
	mouthServiceInstance
		.addMouth(firstMouth)
		.catch((err)=>{console.log(err);});
    //socketConnection;
	mouthServiceInstance
		.addMouth(secondMouth)
		.catch((err)=>{console.log(err);});
	//loading_brains(3011);
	//createBot(3011);
	server.listen(port, () => {
  		console.log(`Mouth server app listening at http://localhost:${port}`)
	});
});

app.get('/socketio', (req, res)=>{
	try{
    //let json_var = {'test':'oui'};
		res.sendFile('/client/socket.html', { root: './..' })
		mouthServiceInstance
			.addMouth(firstMouth)
			.catch((err)=>{console.log(err);});
    	//socketConnection(3012);
		//console.log(mouthServiceInstance);

	}
	catch(err){
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});

app.get('/mouth',async(req,res)=>{
	//let mouthArray=await getMouths();
	//res.status(200).json(mouthArray);
	try{
		let myArrayOfMouths;
		if( undefined == (myArrayOfMouths = mouthServiceInstance.getMouths() )){
			throw new Error("No mouths to get");
		}
		res.status(200).json(myArrayOfMouths);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
})

app.get('/mouthV2',async(req,res)=>{
	try{
		//let json_var = {'test':'oui'};
			res.sendFile('/client/mouthList.html', { root: './..' })
	
		}
		catch(err){
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
})

app.get('/bot',async(req,res)=>{
	botsArray = await getAllBots();
	//let arrayTest = botServiceAccessPoint.getBotById(3011);
	//console.log(botsArray);
	//console.log(arrayTest);
	res.status(200).json(botsArray);
})

app.get('/bot/:idddd', async(req, res)=>{
	let id = req.params.idddd;
	if(!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	}else{
		try{
			let myBot = await getBotById(id);
			console.log("My bot dans l'url ");
			console.log(myBot[0]);
			res.status(200).json([{'name':myBot[0].botName,'mouth':myBot[0].botMouth,'brain':myBot[0].botBrain}]);
			//res.status(200).json({'brain':myBot});
		}
		catch(err){
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
	}
});

/*function socketConnection(){
	//const server = http.createServer(app);
	//const io = new Server(server);
	io.on('connection', (socket) => {
		console.log('a user connected');
		socket.on('chat message', (msg) => {
		  console.log('message: ' + msg);
		  io.emit('chat message', msg);
		});
	  });
}*/

async function getMouths(){
	return mouthServiceAccessPoint.getMouths();
}

async function getAllBots(){
	//console.log(botServiceAccessPoint.getAllBots());
	return await botServiceAccessPoint.getAllBots();
}

async function getBotById(botId){
	return await botServiceAccessPoint.getBotById(botId);
}

function isInt(value) {
	let x = parseFloat(value);
	return !isNaN(value) && (x | 0) === x;
  }
  
function loading_done() {
	console.log("Bot has finished loading!");
	bot.sortReplies();
	let username = "local-user";
	bot.reply(username, "Hello, bot!").then(function(reply) {
	  console.log("The bot says: " + reply);
	});
  }
  
  function loading_error(error, filename, lineno) {
	console.log("Error when loading files: " + error);
  }

async function loading_brains(id){
	console.log("Je suis dans loading_brains");
	let botToLoad = await getBotById(id);
	console.log(botToLoad);
	console.log("Liste des brains : ");
	console.log(botToLoad.botBrain);
	for (let i=0; i<botToLoad.botBrain.length; i++){
		switch((botToLoad.botBrain)[i]){
			case 'Standard':
				console.log("Standard to load");
				botToLoad.botRivescript.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);
				break;
			case 'Client':
				console.log("Client to load");
				botToLoad.botRivescript.loadFile("./../brainServer/pathtobrain/client.rive").then(loading_done).catch(loading_error);
		}
	}
}