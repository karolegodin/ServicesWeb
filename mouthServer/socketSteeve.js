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

const server = http.createServer(app)
//const server = createServer();
const port = process.env.PORT || 3011
const io = new Server(server);

var bot = new RiveScript();

//const pathtoviews = './../server/views';
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', '../server/views');
//const path = require("path");


// Load an individual file.
bot.loadFile("./../brainServer/pathtobrain/standard.rive").then(loading_done).catch(loading_error);

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
		res.render('socketSteeve');

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


//console.log("Hello world");
