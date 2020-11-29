const express = require('express');
const Game = require("./server/game.ts");
const Player = require("./server/player.ts");
const Card = require("./server/card.ts");
const http = require("http").createServer();
const options = {
	cors : true,
	origins:["http://127.0.0.1:3000"],
};
// Initialize Cloud Firestore through Firebase
const firebase = require('firebase/app');
firebase.initializeApp({
    apiKey: "AIzaSyB5kr10op2T-z9PGWggHFuU-XlfS0_rQE8",
    authDomain: "sample-game-database.firebaseapp.com",
    projectId: "sample-game-database",
});
//End of Firebase stuff

const app = express();
const socketIo = require("socket.io")(http, options);
const port = 5000;
//const index = require("./routes/index");

//app.use(index);

let interval;

const title = 'Dont Draw Card'

var SOCKET_LIST = {};

//Initilization of Lobby List
var LOBBY_LIST = {};

socketIo.on("connection", (socket) => {
	//socket.id = Math.random() * 100;
	SOCKET_LIST[socket.id] = socket;
	console.log("New Client connected: " + 	socket.id);
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(() => getApiAndEmit(socket), 100);
	socket.on("disconnect", () => {
		delete SOCKET_LIST[socket.id];
		console.log("Client disconnected: " +  socket.id);
		clearInterval(interval);
	});
	socket.on('ID', (id) => {
		for (var i in SOCKET_LIST)
		{
			var socket = SOCKET_LIST[i];
			console.log(socket.id);
		}
	});
	
	
	//Player has created a lobby
	socket.on('makeLobby', (id) => {
		//console.log(id);
		var name = "";
		
		//Initilization of player list for this lobby
		//let game = new Game(0,id)
		var players = {};
		
		//Initilization of first player
		players[0] = [socket, name, 0]; //game.connect(socket, name)
		
		//Creates this 
		//Lobby id:Lobby ID players: list of Player game: Instance of Game-TODO
		LOBBY_LIST[id] = {id, players/*, game*/};//LOBBY_LIST[id] = game;
		//Console.log every Lobby and every player in a lobby for Debugging
		for (var i in LOBBY_LIST)
		{
			console.log(LOBBY_LIST[i].id);
			for (var k in LOBBY_LIST[i].players)
			{
				console.log(LOBBY_LIST[i].players[k][0].id); //console.log(LOBBY_LIST[i].players[k].id)
			}
			console.log('----------');
		}
	});
	
	//A player has joined a lobby
	socket.on('joinLobby', (id) => {
		console.log(id);
		var name = "";
		
		//Search through all Lobbies to find the lobby to join
		for (var i in LOBBY_LIST)
		{
			if (LOBBY_LIST[i].id == id)
			{
				//Adds the player to the lobby
				LOBBY_LIST[i].players[1] = [socket, name, 0]; //LOBBY_LIST[i].connect(socket,name);
			}
		}
	});
	
	//Debug function
	socket.on('validId', (id) => {
		var hit = false;
		for (var i in LOBBY_LIST)
		{
			if (LOBBY_LIST[i].id == id)
			{
				hit = true;
			}
		}
		socket.emit('valID', hit);
	});
	
	//Sends the list of player names to the player to display
	//called on entering a lobby
	socket.on('enterLobby', (id) => {
		var pack = {};
		for (var i in LOBBY_LIST[id].players)
		{
			pack[i] = [LOBBY_LIST[id].players[i][1], LOBBY_LIST[id].players[i][2]];
			//pack[i] = LOBBY_LIST[id].players[i].name
		}
		socket.emit('updateNames', pack);
	});
	
	//Called when a player updates their name or icon
	socket.on('playerName', (data) =>
	{
		//package that will be sent to every player
		var pack = {};
		
		//Search through this lobby 
		for (var i in LOBBY_LIST[data[1]].players)
		{
			//if this player is the player that updated their name
			if (LOBBY_LIST[data[1]].players[i][0].id == socket.id) //LOBBY_LIST[data[1]].players[i].id == socket.id
			{
				//update their name information
				LOBBY_LIST[data[1]].players[i][1] = data[0]; // LOBBY_LIST[data[1]].players[i].name = 
				LOBBY_LIST[data[1]].players[i][2] = data[2]; // LOBBY_LIST[data[1]].players[i].name = 
				//console.log(LOBBY_LIST[data[1]].players[i][2]);
			}
			//add this players info to pack
			pack[i] = [LOBBY_LIST[data[1]].players[i][1], LOBBY_LIST[data[1]].players[i][2]];
		}
		//Search through this lobby
		for (var i in LOBBY_LIST[data[1]].players)
		{
			//this if-else statement sends the package of player names
			//to every player for display purposes
			if (LOBBY_LIST[data[1]].players[i][0].id == socket.id) //LOBBY_LIST[data[1]].players[i].id == socket.id
			{
				socket.emit('updateNames', pack);
			}
			else {
			socket.to(LOBBY_LIST[data[1]].players[i][0].id).emit('updateNames', pack); 
			//LOBBY_LIST[data[1]].players[i].id.emit
			}
		}
		//console.log('name: ' + data[0] + ' / lobby id: ' + data[1]);
	});
	
	socket.on("gameStarted",  (id) =>
	{
		for (var i in LOBBY_LIST[id].players)
		{
			console.log(LOBBY_LIST[id]);
			console.log(LOBBY_LIST[id].players[0][1]);
			// console.log(LOBBY_LIST[id].players[i]);
			if (LOBBY_LIST[id].players[i][0].id[0] == socket.id)
			{
				socket.emit('startGame', 0);
				console.log('reached here');
			}
			else {
				socket.to(LOBBY_LIST[id].players[i][0].id).emit('startGame', 0);
				console.log('reached here 2');
			}
		}
	});
});

const getApiAndEmit = socket => {
	socket.emit("Title", title);
};

// start express server on port 5000
http.listen(port, () => console.log(`Listening on port ${port}`));