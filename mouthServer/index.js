//importation des modules/fichiers requis
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./../server/routes/authRoutes.js');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./../server/middleware/authMiddleware.js');
const { Client, Intents } = require("discord.js");
const { fork } = require("child_process");
require('dotenv').config();
const Mastodon = require('mastodon-api');
const fs = require('fs');

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

//chargement d'un bot Rivescript
let bot = new RiveScript();
bot.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);

/////////////////////////////////////////////
//Création et connection au bot Discord//////
/////////////////////////////////////////////

//nécessite la présence d'un fichier config.json contenant les clés/secrets dans le dossier 'mouthServer'
const botDiscord = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const { token } = require('./config.json');

botDiscord.login(token);
/////////////////////////////////////////////

/////////////////////////////////////////////
//Création et connection au bot Mastodon/////
/////////////////////////////////////////////
/*
//nécessite la présence d'un fichier .env contenant les clés/secrets dans le dossier 'mouthServer'
const M = new Mastodon({
	client_key: process.env.CLIENT_KEY,
	client_secret: process.env.CLIENT_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	timeout_ms: 60 * 1000, // Requête HTTP optionnelle qui permet d'appliquer un temps maximal à toutes les requêtes
	api_url: 'https://botsin.space/api/v1/',
})*/
/////////////////////////////////////////////

//enable ALL CORS request
app.use(cors())

const port = 3002 //port du serveur de mouths
const port2 = 3004 //port MongoDB

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./../server/views'))
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('views', './../server');//chemin vers le dossier 'views'
app.set('view engine', 'ejs');//recherche les fichiers ejs dans un dossier 'views'

//connection à Mongodb, via l'utilisateur 'user2', à la collection 'auth', via le port d'écoute 3004
const dbURI = 'mongodb+srv://user2:qu6V4nLf5tmSQD4@cluster0.leyyy.mongodb.net/auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then((result) => app.listen(port2), console.log(`Connected to database on port ${port2}`))
	.catch((err) => console.log(err));

//instanciation des deux mouths : Discord et Socket
let firstMouth = {
	'id': 1,
	'name': 'Discord'
};

let secondMouth = {
	'id': 2,
	'name': 'Socket'
};

//création des processus fils pour parler aux trois bots avec Socket.io
const child1 = fork("socketSteeve.js");
const child2 = fork("socketAiden.js");
const child3 = fork("socketTom.js");


function createBot(id) {//attribution d'un cerveau 'standard.rive' au bot d'identifiant 'id'
	let bot = getBotById(id); //bot existant dans la base de données
	let newBot = new RiveScript();
	console.log("Rivescript créé");
	newBot.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);
	bot.botRivescript = "OK";
	return bot.botRivescript
}

//lancement du serveur : ajout des deux mouths dans la base de données
MouthService.create(mouthServiceAccessPoint).then(ms => {
	mouthServiceInstance = ms;
	mouthServiceInstance
		.addMouth(firstMouth)
		.catch((err) => { console.log(err); });
	mouthServiceInstance
		.addMouth(secondMouth)
		.catch((err) => { console.log(err); });
	app.listen(port, () => {
		console.log(`Mouth server app listening at http://localhost:${port}`)
	});
});

//pour toutes les requêtes de type 'get', on vérifie si un utilisateur est connecté via mongodb
//et le système d'authentification
app.get('*', checkUser);

//afficher toutes les mouths au format JSON
app.get('/mouth', async (req, res) => {
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

//obtenir tous les bots à partir d'une requête GET
app.get('/bot', async (req, res) => {
	botsArray = await getAllBots();
	res.status(200).json(botsArray);
});

//obtenir un bot grâce à son id à partir d'une requête GET
app.get('/bot/:idddd', async (req, res) => {
	let id = req.params.idddd;
	if (!isInt(id)) {
		//paramètre incorrect
		res.status(400).send('BAD REQUEST');
	} else {
		try {
			let myBot = await getBotById(id);
			res.status(200).json([{ 'id': myBot[0].botId, 'name': myBot[0].botName, 'mouth': myBot[0].botMouth, 'brain': myBot[0].botBrain, 'botRivescript': myBot[0].botRivescript, 'status': myBot[0].botStatus }]);
		}
		catch (err) {
			console.log(`Error ${err} thrown`);
			res.status(404).send('NOT FOUND');
		}
	}
});

async function getMouths() {//retourne le tableau de toutes les bouches
	return mouthServiceAccessPoint.getMouths();
}

async function getAllBots() {//retourne tous les bots
	return await botServiceAccessPoint.getAllBots();
}

async function getBotById(botId) {//retourne le bot d'identifiant 'botId'
	return await botServiceAccessPoint.getBotById(botId);
}

function isInt(value) {//vérifie si 'value' est de type entier
	let x = parseFloat(value);
	return !isNaN(value) && (x | 0) === x;
}

//chargement d'un bot
function loading_done() {
	console.log("Bot has finished loading!");
	bot.sortReplies();
	let username = "local-user";
	bot.reply(username, "Hello, bot!").then(function (reply) {
		console.log("The bot says: " + reply);
	});
}

//en cas d'erreur de chargement
function loading_error(error, filename, lineno) {
	console.log("Error when loading files: " + error);
}

////////////////////////////////
////Lancement de DISCORD////////
////////////////////////////////

//connection à Discord
botDiscord.on('ready', function () { console.log("Connected to Discord") })

//si réception d'un message sur le canal général
botDiscord.on('messageCreate', message => {
	if (message.channel.name == "general" && message.author.id != botDiscord.application.id) {
		let entry = message.content
		//recherche de la réponse au message reçu dans le cerveau choisi
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

/////////////////////////////
////Lancement de Mastodon////
/////////////////////////////
/*
const listener = M.stream('streaming/user')
listener.on('error', err => console.log(err))

listener.on('message', msg => {
	if (msg.event === 'notification') {
		const acct = msg.data.account.acct;
		if (msg.data.type === 'mention') {
			postMsg(`@${acct} Got your message !`);

			let entry = msg.data.status.content;
			const id = msg.data.status.id;
			bot.reply(id, entry).then(function (reply) {
				var output = reply;
				if (output != "Error::No Reply Matched") {
					postMsg(`@${id} ${output}`);
				}
				else {
					const reply2 = `@${acct} I do not understand your request. Please try again.`;
					postMsg(`@${id} ${reply2}`);
				}
			});
		}
	}
});

function postMsg(content, id) {//envoie la réponse du bot Mastodon sur la plateforme
	const params = {
		status: content
	}
	if (id) {
		params.in_reply_to_id = id;
	}
	M.post('statuses', params, (error, data) => {
		if (error) {
			console.error(error);
		} else {
			console.log(`ID:${data.id} and timestamp:${data.created_at} `);
			console.log(data.content);
		}
	});
}
*/

//fonction middleware qui lie le router 'authRoutes' à l'application
app.use(authRoutes);