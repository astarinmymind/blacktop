const express = require('express');
const {Game, readfromDatabase, updateDatabase, addtoDatabase} = require("./server/game.ts");
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
		//Create a new Game associated with this lobby.
		var game = new Game(parseInt(id));
		
		//Initialization of first player
		game.connect(socket, "", 0);
		LOBBY_LIST[parseInt(id)] = game;
		//Console.log every Lobby and every player in a lobby for Debugging
		for (var gameID in LOBBY_LIST)
		{
			var playerlist = LOBBY_LIST[gameID].players;
			for (var i = 0; i < playerlist.length; i++)
				console.log(playerlist[i].socket.id);
			console.log('----------');
		}
	});
	
	//A player has joined a lobby
	socket.on('joinLobby', (id) => {
		console.log(id);
		var name = "";
		//If the lobby is valid, add this Player to the Game.
		if (parseInt(id) in LOBBY_LIST && typeof LOBBY_LIST[parseInt(id)] !== undefined) {
			LOBBY_LIST[parseInt(id)].connect(socket, name, 0);
		}
	});
	
	//Debug function
	socket.on('validId', (id) => {
		var hit = false;
		if (parseInt(id) in LOBBY_LIST && typeof LOBBY_LIST[parseInt(id)] !== undefined) {
			hit = true;
		}
		socket.emit('valID', hit);
	});
	
	//Sends the list of player names to the player to display
	//called on entering a lobby
	socket.on('enterLobby', (id) => {
		var pack = {};
		console.log(id);
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
			pack[id] = [playerlist[i].name, playerlist[i].icon];
		socket.emit('updateNames', pack);
	});
	
	//Called when a player updates their name or icon
	socket.on('playerName', (data) =>
	{
		//Package that will be sent to every player.
		var pack = {};

		// data[0] is player name, data[1] is game ID, data[2] is player icon
		gameID = parseInt(data[1]);
		console.log(LOBBY_LIST);
		var playerlist = LOBBY_LIST[gameID].players;
		// find this Player in the game's Player array, and update their name + icon
		for (var i = 0; i < playerlist.length; i++)
		{
			if (playerlist[i].socket.id == socket.id)
			{
				playerlist[i].name = data[0];
				playerlist[i].icon = data[2];
			}
			//add Players' info to pack
			pack[i] = [playerlist[i].name, playerlist[i].icon];
		}

		//Search through this lobby
		for (var i = 0; i < playerlist.length; i++)
		{
			//this if-else statement sends the package of player names
			//to every player for display purposes
			if (playerlist[i].socket.id == socket.id)
				socket.emit('updateNames', pack);
			else 
				socket.to(playerlist[i].id).emit('updateNames', pack); 
		}
		//console.log('name: ' + data[0] + ' / lobby id: ' + data[1]);
	});
	
	socket.on("gameStarted", (id) =>
	{
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
		{
			var player = playerlist[i];
			console.log(player);
			// console.log(LOBBY_LIST[id].players[i]);
			if (player.socket.id === socket.id)
			{
				socket.emit('startGame', 0);
				console.log('reached here');
			}
			else {
				socket.to(player.socket.id).emit('startGame', 0);
				console.log('reached here 2');
			}
			player.addCard(new Card('nope'));
			player.addCard(new Card('give'));
			sendHand(player.socket, id, player.hand, i); 
		}
	});
	
	socket.on('cardDrawn', (id) =>
	{
		//grab a card from the backend TODO
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
		{
			sendHand(playerlist[0].socket, parseInt(id), playerlist[0].hand, i); 
		}
	});
	
	socket.on('cardPlayed', (id) =>
	{
		//play the card that is given TODO
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
		{
			sendHand(playerlist[0].socket, parseInt(id), playerlist[0].hand, i); 
		}
	});
	
	//sends 1 players hand to everyone
	function sendHand(socket, id, hand, elem) {
		var pack = { hand, elem };
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
		{
			if (playerlist[i].socket.id == socket.id)
			{
				socket.emit('playerHand', pack);
			}
			else {
				socket.to(playerlist[i].socket.id).emit('otherHand', pack);
			}
		}
	}
	
});

const getApiAndEmit = socket => {
	socket.emit("Title", title);
};

// start express server on port 5000
http.listen(port, () => console.log(`Listening on port ${port}`));