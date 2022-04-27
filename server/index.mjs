import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
import RiveScript from 'rivescript';

import {BotService} from "./models/BotService_ArrayImpl.mjs";
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});

import {BrainService} from "./models/BrainService_ArrayImpl.mjs";
let brainServiceInstance;
//let brainServiceAccessPoint = new BrainService({url:"http://localhost",port:3001});

import {MouthService} from "./models/MouthService_ArrayImpl.mjs";
let mouthServiceInstance;
//let mouthServiceAccessPoint = new MouthService({url:"http://localhost",port:3002});

//// Enable ALL CORS request
app.use(cors())
////

const port = 3001

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

/*
*****************************
BOT RIVESCRIPT
*****************************
*/

var bot = new RiveScript();

// Load a directory full of RiveScript documents (.rive files). This is for
// Node.JS only: it doesn't work on the web!
//bot.loadDirectory("pathtobrain").then(loading_done).catch(loading_error);

// Load an individual file.
bot.loadFile("pathtobrain/standard.rive").then(loading_done).catch(loading_error);
let username = "local-user";

// Load a list of files all at once (the best alternative to loadDirectory
// for the web!)
/*bot.loadFile([
  "brain/begin.rive",
  "brain/admin.rive",
  "brain/clients.rive"
]).then(loading_done).catch(loading_error);*/

// All file loading operations are asynchronous, so you need handlers
// to catch when they've finished. If you use loadDirectory (or loadFile
// with multiple file names), the success function is called only when ALL
// the files have finished loading.
function loading_done() {
  console.log("Bot has finished loading!");

  // Now the replies must be sorted!
  bot.sortReplies();

  // And now we're free to get a reply from the brain!

  // RiveScript remembers user data by their username and can tell
  // multiple users apart.
  //let username = "local-user";

  // NOTE: the API has changed in v2.0.0 and returns a Promise now.
  bot.reply(username, "Hello, bot!").then(function(reply) {
    console.log("The bot says: " + reply);
  });
  sendMessage("Coucou bande de nouilles");
}

// It's good to catch errors too!
function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}

let id = 0 ; //Math.floor(Math.random() * Math.floor(100000)) ;
let aBot ={ //UGLY
	'id':id,
	'title':'Random Title',
};

BotService.create(botServiceAccessPoint).then(bs=>{
	botServiceInstance=bs;
	botServiceInstance
		.addBot(aBot)
		.catch((err)=>{console.log(err);});
	app.listen(port, () => {
  		console.log(`Example app listening at http://localhost:${port}`)
	});
});

// Handle sending a message to the bot.
function sendMessage (text) {
  console.log("You say: " + text);
	//$("#message").val("");
	//$("#dialogue").append("<div><span class='user'>You:</span> " + text + "</div>");
  bot.sortReplies();
  console.log("tabernacle : " + username);
  bot.reply(username,text).then(function(reply) {
    console.log("The bot says: " + reply);
  });
	/*bot.reply(username, text, this).then(function(reply) {
		reply = reply.replace(/\n/g, "<br>");*/
    
		//$("#dialogue").append("<div><span class='bot'>Bot:</span> " + reply + "</div>");
		//$("#dialogue").animate({ scrollTop: $("#dialogue").height() }, 1000);
	/*}).catch(function(e) {
		console.log(e.message + "\n" + e.line);*/
  //return false;
}



function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}