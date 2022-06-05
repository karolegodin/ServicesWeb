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
const { fork } = require("child_process");

const app = express();
const RiveScript = require('rivescript');

const { MouthService } = require('./models/MouthService_ArrayImpl.js');
const { Mouth } = require('./models/Mouth.js');
let mouthServiceInstance;
let mouthServiceAccessPoint = new MouthService({ url: "http://localhost", port: 3002 });

const { BotIdentifier, BotService } = require('./models/Bots.js');
let botServiceInstance;
let botServiceAccessPoint = new BotService({ url: "http://localhost", port: 3001 });
let botsArray;

const server = http.createServer(app)
//const server = createServer();
const port = process.env.PORT || 3012
const io = new Server(server);

var bot = new RiveScript();

//const pathtoviews = './../server/views';
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', '../server/views');
//const path = require("path");


// Load an individual file.
//bot.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);
loading_brains(3012);

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


// just to test the server
app.get('/socketio', (req, res) => {
  //res.status(200).send('Working')
  try{
    loading_brains(3012); //recharger la liste des brains en cas d'ajout/suppression
		res.render('socketAiden');

	}
	catch(err){
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
})

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

server.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})

async function loading_brains(id) {
	//console.log("Je suis dans loading_brains");
	let botToLoad = await getBotById(id);
	//console.log(botToLoad);
	console.log("Liste des brains : ");
	console.log(botToLoad[0].botBrain);
	for (let i = 0; i < botToLoad[0].botBrain.length; i++) {
		switch ((botToLoad[0].botBrain)[i]) {
			case 'Standard':
				console.log("Standard to load");
				bot.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);
				break;
			case 'Client':
				console.log("Client to load");
				bot.loadFile("./../brainServer/pathtobrain/client.rive").then(loading_done).catch(loading_error);
		}
	}
}

async function getBotById(botId) {
	return await botServiceAccessPoint.getBotById(botId);
}

//console.log("Hello world");
