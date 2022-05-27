import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
import RiveScript from 'rivescript';

/*import {BotService} from "./models/BotService_ArrayImpl.mjs";
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});*/

/*import {BrainService} from "./models/BrainService_ArrayImpl.mjs";
let brainServiceInstance;
let brainServiceAccessPoint = new BrainService({url:"http://localhost",port:3001});*/

/*import {MouthService} from "../mouthServer/models/MouthService_ArrayImpl.mjs";
import { Bot } from './models/Bot.mjs';
let mouthServiceInstance;
let mouthServiceAccessPoint = new MouthService({url:"http://localhost",port:3002});*/

import {BrainService} from "./models/BrainService_ArrayImpl.mjs";
import { Brain } from './models/Brain.mjs';
let brainServiceInstance;
let brainServiceAccessPoint = new BrainService({url:"http://localhost",port:3003});

import {BotIdentifier,BotService} from "./models/Bots.mjs";
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});
let botsArray;

//// Enable ALL CORS request
app.use(cors())
////

const port = 3003

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(express.static('./../client'))

let firstBrain ={ 
	'id':0,
	'name':'Standard'
};

BrainService.create(brainServiceAccessPoint).then(ms=>{
	brainServiceInstance=ms;
	brainServiceInstance
		.addBrain(firstBrain)
		.catch((err)=>{console.log(err);});
    //socketConnection;
	/*brainServiceInstance
		.addBrain(secondBrain)
		.catch((err)=>{console.log(err);});*/
	app.listen(port, () => {
  		console.log(`Brain server app listening at http://localhost:${port}`)
	});
});

app.get('/bot',async(req,res)=>{
	botsArray = await getAllBots();
	//console.log("heheheee");
	console.log(botsArray);
	res.status(200).json(botsArray);
})

app.get('/brain',async(req,res)=>{
	//let brainArray=await getBrains();
	//res.status(200).json(brainArray);
	try{
		let myArrayOfBrains;
		if( undefined == (myArrayOfBrains = brainServiceInstance.getBrains() )){
			throw new Error("No brains to get");
		}
		res.status(200).json(myArrayOfBrains);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
})

async function getBrains(){
	return brainServiceAccessPoint.getBrains();
}

async function getAllBots(){
	//console.log(botServiceAccessPoint.getAllBots());
	return await botServiceAccessPoint.getAllBots();
}
