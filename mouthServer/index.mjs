import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import http from "http";
import {Server} from "socket.io";

const app = express();
import RiveScript from 'rivescript';

/*import {BotService} from "./models/BotService_ArrayImpl.mjs";
let botServiceInstance;
let botServiceAccessPoint = new BotService({url:"http://localhost",port:3001});*/

/*import {BrainService} from "../brainServer/models/BrainService_ArrayImpl.mjs";
let brainServiceInstance;
let brainServiceAccessPoint = new BrainService({url:"http://localhost",port:3001});*/

import {MouthService} from "./models/MouthService_ArrayImpl.mjs";
import { Mouth } from './models/Mouth.mjs';
let mouthServiceInstance;
let mouthServiceAccessPoint = new MouthService({url:"http://localhost",port:3002});

//// Enable ALL CORS request
app.use(cors())
////

const port = 3002

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(express.static('./../client'))

app.use(express.static('./../client'))

let firstMouth ={ 
	'id':0,
	'name':'Socket'
};

MouthService.create(mouthServiceAccessPoint).then(ms=>{
	mouthServiceInstance=ms;
	/*mouthServiceInstance
		.addMouth(firstMouth)
		.catch((err)=>{console.log(err);});
    socketConnection;*/
	app.listen(port, () => {
  		console.log(`Mouth server app listening at http://localhost:${port}`)
	});
});

app.get('/socketio', (req, res)=>{
	try{
    //let json_var = {'test':'oui'};
		res.sendFile('/client/socket.html', { root: './..' })
		mouthServiceInstance
			.addMouth(firstMouth)
			.catch((err)=>{console.log(err);});
    	socketConnection();

	}
	catch(err){
		console.log(`Error ${err} thrown`);
		res.status(404).send('NOT FOUND');
	}
});

function socketConnection(){
	const server = http.createServer(app);
	const io = new Server(server);
	io.on('connection', (socket) => {
		console.log('a user connected');
		socket.on('chat message', (msg) => {
		  console.log('message: ' + msg);
		  io.emit('chat message', msg);
		});
	  });
}

/*async function getAllMouth(){
	return await mouthServiceAccessPoint.getAllMouth();
}*/