const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./../server/routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./../server/middleware/authMiddleware.js');
const { Client, Intents } = require("discord.js");

const app = express();
const RiveScript = require('rivescript');

/*import {BotService} from "./models/BotService_ArrayImpl.mjs";
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});*/

/*import {BrainService} from "../brainServer/models/BrainService_ArrayImpl.mjs";
let brainServiceInstance;
let brainServiceAccessPoint = new BrainService({url:"http://localhost",port:3001});*/

const { MouthService } = require('./models/MouthService_ArrayImpl.js');
const { Mouth } = require('./models/Mouth.js');
let mouthServiceInstance;
let mouthServiceAccessPoint = new MouthService({ url: "http://localhost", port: 3002 });

const { BotIdentifier, BotService } = require('./models/Bots.js');
let botServiceInstance;
let botServiceAccessPoint = new BotService({ url: "http://localhost", port: 3001 });
let botsArray;

/////////////////////////////////
//Connection au bot Discord//////
/////////////////////////////////
const botDiscord = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const { token } = require('./config.json');

botDiscord.login(token);
////////////////////////////////

//// Enable ALL CORS request
app.use(cors())
////

const port = 3002

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./../server/views'))
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('views', './../server/views');
app.set('view engine', 'ejs');

let firstMouth = {
	'id': 1,
	'name': 'Socket'
};

let secondMouth = {
	'id': 2,
	'name': 'Discord'
};

var bot = new RiveScript();
bot.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);
//bot.loadFile("./../brainServer/pathtobrain/client.rive").then(loading_done).catch(loading_error);
//bot.loadFile("./../brainServer/pathtobrain/eliza.rive").then(loading_done).catch(loading_error);

//let server;
//let io;
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
	console.log('a user connected');
	let username = "local-user";
	socket.on('chat message', (msg) => {
		console.log('message: ' + msg);
		bot.reply(username, msg).then(function (reply) {
			console.log("The bot says: " + reply);
			io.emit('chat message', msg);
			io.emit('chat message', reply);
		});

	});
});

/*io.on("connect_error", (err) => {
	console.log(`connect_error due to ${err.message}`);
  });*/
function createBot(id) {
	let bot = getBotById(id); //bot existant dans la base de données
	//console.log("bot " +bot);
	let newBot = new RiveScript();
	console.log("Rivescript créé");
	//console.log(bot.botRivescript);
	newBot.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);
	bot.botRivescript = "OK";
	return bot.botRivescript
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

MouthService.create(mouthServiceAccessPoint).then(ms => {
	mouthServiceInstance = ms;
	mouthServiceInstance
		.addMouth(firstMouth)
		.catch((err) => { console.log(err); });
	//socketConnection;
	mouthServiceInstance
		.addMouth(secondMouth)
		.catch((err) => { console.log(err); });
	//loading_brains(3011);
	server.listen(port, () => {
		console.log(`Mouth server app listening at http://localhost:${port}`)
	});
});

app.get('*', checkUser);

app.get('/socketio', (req, res) => {
	try {
		//let json_var = {'test':'oui'};
		res.render('socket')
		mouthServiceInstance
			.addMouth(firstMouth)
			.catch((err) => { console.log(err); });
		//socketConnection(3012);
		//console.log(mouthServiceInstance);

	}
	catch (err) {
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});

app.get('/mouth', async (req, res) => {
	//let mouthArray=await getMouths();
	//res.status(200).json(mouthArray);
	try {
		let myArrayOfMouths;
		if (undefined == (myArrayOfMouths = mouthServiceInstance.getMouths())) {
			throw new Error("No mouths to get");
		}
		res.status(200).json(myArrayOfMouths);
	}
	catch (err) {
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
});

app.get('/mouthV2', async (req, res) => {
	try {
		//let json_var = {'test':'oui'};
		res.render('mouthList')

	}
	catch (err) {
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});

app.get('/bot', async (req, res) => {
	botsArray = await getAllBots();
	//let arrayTest = botServiceAccessPoint.getBotById(3011);
	//console.log(botsArray);
	//console.log(arrayTest);
	res.status(200).json(botsArray);
});

app.get('/bot/:idddd', async (req, res) => {
	let id = req.params.idddd;
	if (!isInt(id)) {
		//not the expected parameter
		res.status(400).send('BAD REQUEST');
	} else {
		try {
			let myBot = await getBotById(id);
			console.log("My bot dans l'url ");
			console.log(myBot[0]);
			res.status(200).json([{'id': myBot[0].botId, 'name': myBot[0].botName, 'mouth': myBot[0].botMouth, 'brain': myBot[0].botBrain, 'botRivescript': myBot[0].botRivescript }]);
			//res.status(200).json({'brain':myBot});
			createBot(3011);
		}
		catch (err) {
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

async function getMouths() {
	return mouthServiceAccessPoint.getMouths();
}

async function getAllBots() {
	//console.log(botServiceAccessPoint.getAllBots());
	return await botServiceAccessPoint.getAllBots();
}

async function getBotById(botId) {
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
	bot.reply(username, "Hello, bot!").then(function (reply) {
		console.log("The bot says: " + reply);
	});
}

function loading_error(error, filename, lineno) {
	console.log("Error when loading files: " + error);
}

botDiscord.on('ready', function () { console.log("Connected to Discord") })

botDiscord.on('messageCreate', message => {
	if (message.channel.name == "general" && message.author.id != botDiscord.application.id) {
		let entry = message.content
		bot.reply(message.author.name, entry).then(function (reply) {
			var output = reply;
			if (output != "Error::No Reply Matched") {
				message.channel.send(output)
			}
			else {
				message.channel.send("I do not understand, please be more precise.")
			}
		}
		);
	}
})

async function loading_brains(id) {
	console.log("Je suis dans loading_brains");
	let botToLoad = await getBotById(id);
	console.log(botToLoad);
	console.log("Liste des brains : ");
	console.log(botToLoad.botBrain);
	for (let i = 0; i < botToLoad.botBrain.length; i++) {
		switch ((botToLoad.botBrain)[i]) {
			case 'Standard':
				console.log("Standard to load");
				botToLoad.botRivescript.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);
				break;
			case 'Eliza':
				console.log("Eliza to load");
				botToLoad.botRivescript.loadFile("./../brainServer/pathtobrain/eliza.rive").then(loading_done).catch(loading_error);
				break;
			case 'Client':
				console.log("Client to load");
				botToLoad.botRivescript.loadFile("./../brainServer/pathtobrain/client.rive").then(loading_done).catch(loading_error);
		}
	}
}

app.use(authRoutes);