const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const authRoutes = require('./../server/routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./../server/middleware/authMiddleware.js');

const app = express();
const RiveScript = require('rivescript');

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

const {BrainService} = require("./models/BrainService_ArrayImpl.js");
const { Brain } = require('./models/Brain.js');
let brainServiceInstance;
let brainServiceAccessPoint = new BrainService({url:"http://localhost",port:3003});

const {BotIdentifier,BotService} = require("./models/Bots.js");
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});
let botsArray;

//// Enable ALL CORS request
app.use(cors())
////

const port = 3003

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(express.static('./../server/views'))
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('views','./../server/views');
app.set('view engine', 'ejs');

let firstBrain ={ 
	'id':0,
	'name':'Standard'
};

let secondBrain ={ 
	'id':1,
	'name':'Client'
};

BrainService.create(brainServiceAccessPoint).then(ms=>{
	brainServiceInstance=ms;
	brainServiceInstance
		.addBrain(firstBrain)
		.catch((err)=>{console.log(err);});
	brainServiceInstance
		.addBrain(secondBrain)
		.catch((err)=>{console.log(err);});
    //socketConnection;
	/*brainServiceInstance
		.addBrain(secondBrain)
		.catch((err)=>{console.log(err);});*/
	app.listen(port, () => {
  		console.log(`Brain server app listening at http://localhost:${port}`)
	});
});

app.get('*', checkUser);

app.get('/bot',requireAuth,async(req,res)=>{
	botsArray = await getAllBots();
	//console.log("heheheee");
	console.log(botsArray);
	res.status(200).json(botsArray);
})

app.get('/brain',requireAuth,async(req,res)=>{
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

app.get('/brainV2',requireAuth,async(req,res)=>{
	try{
		//let json_var = {'test':'oui'};
			res.render('brainList')
	
		}
		catch(err){
			console.log(`Error ${err} thrown`);
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

async function getBotById(botId){
	return await botServiceAccessPoint.getBotById(botId);
}

app.use(authRoutes);
