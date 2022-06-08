const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const authRoutes = require('./../server/routes/authRoutes.js');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./../server/middleware/authMiddleware.js');

const app = express();
const RiveScript = require('rivescript');

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

const port = 3003 //port du server
const port2 = 3005 //port MongoDB

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(express.static('./../server/views'))
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('views','./../server');
app.set('view engine', 'ejs');

const dbURI = 'mongodb+srv://user3:NYlrbhnAJDBkLiLu@cluster0.leyyy.mongodb.net/auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(port2), console.log(`Connected to database on port ${port2}`))
  .catch((err) => console.log(err));

//instanciation des deux brains : Standard et Client

let firstBrain ={ 
	'id':0,
	'name':'Standard'
};

let secondBrain ={ 
	'id':1,
	'name':'Client'
};

//lancement du serveur : ajout des deux brains dans la base de données
BrainService.create(brainServiceAccessPoint).then(ms=>{
	brainServiceInstance=ms;
	brainServiceInstance
		.addBrain(firstBrain)
		.catch((err)=>{console.log(err);});
	brainServiceInstance
		.addBrain(secondBrain)
		.catch((err)=>{console.log(err);});
	app.listen(port, () => {
  		console.log(`Brain server app listening at http://localhost:${port}`)
	});
});

app.get('*', checkUser);

//récupérer tous les bots du serveur de bots
app.get('/bot',async(req,res)=>{
	botsArray = await getAllBots();
	//console.log("heheheee");
	console.log(botsArray);
	res.status(200).json(botsArray);
})

//afficher tous les brains au format JSON
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

async function getBotById(botId){
	return await botServiceAccessPoint.getBotById(botId);
}

app.use(authRoutes);
