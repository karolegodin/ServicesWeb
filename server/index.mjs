import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import http from "http";
import {Server} from "socket.io";

const app = express();
import RiveScript from 'rivescript';

import {BotService} from "./models/BotService_ArrayImpl.mjs";
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});

import {MouthIdentifier,MouthService} from "./models/Mouths.mjs";
let mouthServiceInstance;
let mouthServiceAccessPoint = new MouthService({url:"http://localhost",port:3002});


/*import {BrainService} from "../brainServer/models/BrainService_ArrayImpl.mjs";
let brainServiceInstance;
let brainServiceAccessPoint = new BrainService({url:"http://localhost",port:3001});*/

/*import {MouthService} from "../mouthServer/models/MouthService_ArrayImpl.mjs";
import { Bot } from './models/Bot.mjs';
let mouthServiceInstance;
let mouthServiceAccessPoint = new MouthService({url:"http://localhost",port:3002});*/

//// Enable ALL CORS request
app.use(cors())
////

const port = 3001

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(express.static('./../client'))


let id = 0 ; 
let firstBot ={ 
	'id':0,
	'name':'Steve'
};

BotService.create(botServiceAccessPoint).then(bs=>{
	botServiceInstance=bs;
	botServiceInstance
		.addBot(firstBot)
		.catch((err)=>{console.log(err);});
	//console.log(bs);
	app.listen(port, () => {
		console.log(firstBot.id, firstBot.name)
  		console.log(`Example app listening at http://localhost:${port}`)
	});
});


//Page d'accueil
app.get('/', (req, res)=>{
	try{
    //let json_var = {'test':'oui'};
		res.sendFile('/client/index.html', { root: './..' })

	}
	catch(err){
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});

//Page pour parler à un bot
app.get('/createBot', (req, res)=>{
	try{
    //let json_var = {'test':'oui'};
		res.sendFile('/client/createBot.html', { root: './..' })

	}
	catch(err){
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});


//EXEMPLE DU TP3 :
/*app.get('/v2/tasks/', (req, res)=>{
	try{
		let myArrayOfTasks;
		if( undefined == (myArrayOfTasks = taskServiceInstance.getTasks() )){
			throw new Error("No tasks to get");
		}
		res.status(200).json(myArrayOfTasks);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
})*/

/*app.get('/brains',async(req,res)=>{
	let brainsArray=await getAllBrains();
	res.status(200).json(brainsArray);
})*/

app.get('/mouth',async(req,res)=>{
	let mouthsArray = await getAllMouths();
	res.status(200).json(mouthsArray);
})

//const server = http.createServer(app);
//const io = new Server(server);
//PARLER AVEC SOCKET
app.get('/socketio', (req, res)=>{
	try{
		res.sendFile('/client/index.html', { root: './..' })
		/*io.on('connection', (socket) => {
			console.log('a user connected');
			let username = "local-user";
			socket.on('chat message', (msg) => {
			  console.log('message: ' + msg);
			  firstBot.botRivescript.reply(username,msg).then(function(reply) {
				console.log("The bot says: " + reply);
				io.emit('chat message', msg);
				io.emit('chat message', reply);
			  });
		  
			});
		  });*/

	}
	catch(err){
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});

app.get('/bot',async(req,res)=>{
	//let botArray=await getBots();
	//res.status(200).json(botArray);
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

//create a new bot (POST HTTP method)
/*app.post('/bots',(req,res)=>{
	let theBotToAdd = req.body;
	botServiceInstance
		.addBot(theBotToAdd) 
		.then((returnString)=>{
			console.log(returnString);
			res.status(201).send('New bot added');
		})
		.catch((err)=>{
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(400).send('BAD REQUEST');
		});	
	getAllMouths();
});*/

/*app.delete();

app.patch();*/

app.post('/v2/bots/',(req,res)=>{
	let thebotToAdd = req.body;
	botServiceInstance
		.addBot(thebotToAdd) 
		.then((returnString)=>{
			console.log(returnString);
			res.status(201).send('All is OK');
		})
		.catch((err)=>{
			console.log(`Error ${err} thrown... stack is : ${err.stack}`);
			res.status(400).send('BAD REQUEST');
		});	
});

function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

/*async function getAllBots(){
	return await botServiceAccessPoint.getAllBots();
}*/

/*async function getAllBrains(){
	return await brainServiceAccessPoint.getAllBrains();
}*/

async function getAllMouths(){
	return await mouthServiceAccessPoint.getAllMouths();
}

/*async function getMouthById(id){
	getAllMouths();
}*/

async function getBots(){
	console.log(botServiceAccessPoint);
	return botServiceAccessPoint.getBots();
}