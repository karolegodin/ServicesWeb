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
const port = process.env.PORT || 3013
const io = new Server(server);

//////////////////////////////////////////////////
//PARLER A TOM AVEC SOCKET.IO SUR LE PORT 3013
//////////////////////////////////////////////////

var bot = new RiveScript();

app.set('view engine', 'ejs');//recherche les fichiers ejs dans un dossier 'views'
app.set('views', '../server/views');//chemin vers le dossier 'views'

//chargement des brains
loading_brains(3013);

//chargement d'un bot
function loading_done() {
  console.log("Bot has finished loading!");
  bot.sortReplies();
  let username = "local-user";
  bot.reply(username, "Hello, bot!").then(function(reply) {
    console.log("The bot says: " + reply);
  });
}

//en cas d'erreur de chargement
function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}

//affiche la page pour parler à Tom avec Socket.io grâce à une requête de type 'GET'
app.get('/socketio', (req, res) => {
  try{
    loading_brains(3013); //recharger la liste des brains en cas d'ajout/suppression
		res.render('socketTom');
	}
	catch(err){
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
})

//lancement du serveur Socket.io
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

//'server' écoute sur le port 'port'
server.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})

//chargement des différents brains du bot
async function loading_brains(id) {
	let botToLoad = await getBotById(id);
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

//obtenir un bot grâce à son id avec une requête GET
async function getBotById(botId) {
	return await botServiceAccessPoint.getBotById(botId);
}