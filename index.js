const express = require('express');
const {Game, readfromDatabase, updateDatabase, addtoDatabase} = require('./server/game.ts');
const Player = require('./server/player.ts');
const Card = require('./server/card.ts');
const http = require('http').createServer();
const options = {
	cors : true,
	origins:['http://127.0.0.1:3000'],
};

// initialize Cloud Firestore through Firebase
const firebase = require('firebase/app');
firebase.initializeApp({
    apiKey: 'AIzaSyB5kr10op2T-z9PGWggHFuU-XlfS0_rQE8',
    authDomain: 'sample-game-database.firebaseapp.com',
    projectId: 'sample-game-database',
});
// end of Firebase stuff

const app = express();
const socketIo = require('socket.io')(http, options);
const port = 5000;
//const index = require("./routes/index");

//app.use(index);

let interval;

const title = "Don't Draw Card"

var SOCKET_LIST = {};

//Initilization of Lobby List
var LOBBY_LIST = {};

socketIo.on('connection', (socket) => {
	//socket.id = Math.random() * 100;
	SOCKET_LIST[socket.id] = socket;
	console.log('New client connected: ' + 	socket.id);
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(() => getApiAndEmit(socket), 100);
	socket.on('disconnect', () => {
		delete SOCKET_LIST[socket.id];
		console.log('Client disconnected: ' +  socket.id);
		clearInterval(interval);
	});
	socket.on('ID', (id) => {
		for (var i in SOCKET_LIST)
		{
			var socket = SOCKET_LIST[i];
			console.log(socket.id);
		}
	});
	
	
	// a lobby has been created by a player
	socket.on('makeLobby', (id) => {
		// create a new Game associated with this lobby
		var game = new Game(parseInt(id));
		
		// connect first Player to the Game
		game.connect(socket, "", 0);
		LOBBY_LIST[parseInt(id)] = game;

		// console.log every Lobby and every player in a lobby for debugging
		for (var gameID in LOBBY_LIST)
		{
			var playerlist = LOBBY_LIST[gameID].players;
			for (var i = 0; i < playerlist.length; i++)
				console.log('Player: ', playerlist[i].socket.id);
			console.log('----------');
		}
	});
	
	// a player has joined an existing lobby
	socket.on('joinLobby', (id) => {
		console.log('Player has joined lobby: ', id);

		// if the lobby is valid, connect the new Player to the associated Game
		if (parseInt(id) in LOBBY_LIST && typeof LOBBY_LIST[parseInt(id)] !== undefined) {
			LOBBY_LIST[parseInt(id)].connect(socket, "", 0);
		}
	});
	
	// debug function
	socket.on('validId', (id) => {
		var hit = false;
		if (parseInt(id) in LOBBY_LIST && typeof LOBBY_LIST[parseInt(id)] !== undefined) {
			hit = true;
		}
		socket.emit('valID', hit);
	});
	
	// sends the list of all player names to the player to display
	// called on entering a lobby
	socket.on('enterLobby', (id) => {
		var pack = {};
		console.log('Player has entered lobby ', id);
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
			pack[id] = [playerlist[i].name, playerlist[i].icon];
		socket.emit('updateNames', pack);
	});
	
	// called when a player updates their name or icon
	socket.on('playerName', (data) =>
	{
		// package that will be sent to every player (display name + icon)
		var pack = {};

		// data[0] is player name, data[1] is game ID, data[2] is player icon
		gameID = parseInt(data[1]);
		var playerlist = LOBBY_LIST[gameID].players;

		// find this Player in the game's Player array, and update their name + icon
		for (var i = 0; i < playerlist.length; i++)
		{
			var player = playerlist[i];
			if (player.socket.id == socket.id)
			{
				player.name = data[0];
				player.icon = data[2];
			}
			//add Players' info to pack
			pack[i] = [player.name, player.icon];
		}

		// send the package of player names + icons to every player (for display)
		for (var i = 0; i < playerlist.length; i++)
		{
			if (playerlist[i].socket.id == socket.id)
				socket.emit('updateNames', pack);
			else 
				socket.to(playerlist[i].id).emit('updateNames', pack); 
		}
	});
	
	socket.on('gameStarted', (id) =>
	{
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
		{
			var player = playerlist[i];
			console.log('Player present in game: ', player);
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
		// grab a Card from the backend TODO
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
		{
			sendHand(playerlist[0].socket, parseInt(id), playerlist[0].hand, i); 
		}
	});
	
	socket.on('cardPlayed', (id) =>
	{
		// play the Card that is given TODO
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
		{
			sendHand(playerlist[0].socket, parseInt(id), playerlist[0].hand, i); 
		}
	});
	
	// sends one Player's hand to everyone
	function sendHand(socket, id, hand, elem) {
		var pack = { hand, elem };
		var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist.length; i++)
		{
			if (playerlist[i].socket.id == socket.id)
				socket.emit('playerHand', pack);
			else
				socket.to(playerlist[i].socket.id).emit('otherHand', pack);
		}
	}
	
});

const getApiAndEmit = socket => {
	socket.emit('Title', title);
};

// start express server on port 5000
http.listen(port, () => console.log(`Listening on port ${port}`));