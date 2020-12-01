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
const { read } = require('fs');
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
	socket.on('makeLobby', async (id) => {
		// create a new Game associated with this lobby
		var game = new Game(parseInt(id));
		
		// connect first Player to the Game
		game.connect(socket.id, "", 0);
		//LOBBY_LIST[parseInt(id)] = game;
		//add to the database
		let success = await addtoDatabase(game);
		//console.log(success);
		// console.log every Lobby and every player in a lobby for debugging
		let result = await readfromDatabase(id);
		if(result ===  null){
			return;
		}

		let playerlist = result.players;
			for (var i = 0; i < playerlist.length; i++)
				console.log('Player: ', playerlist[i].socketID);
			console.log('----------');
	});
	
	// a player has joined an existing lobby
	socket.on('joinLobby', async (id) => {
		console.log('Player has joined lobby ', id);
		let game = await readfromDatabase(id);
		if (game === null){
			return;
		}
			game.connect(socket.id, "", 0);
			await updateDatabase(game);

		// if the lobby is valid, connect the new Player to the associated Game
		// if (parseInt(id) in LOBBY_LIST && typeof LOBBY_LIST[parseInt(id)] !== undefined) {
		// 	LOBBY_LIST[parseInt(id)].connect(socket.id, "", 0);
		// }
	});
	
	// debug function
	socket.on('validId', async (id) => {
		//var hit = false;
		var hit2 = await readfromDatabase(id);
		if(hit2 === null)
			hit2 = false;
		else
			hit2 = true;
		// if (parseInt(id) in LOBBY_LIST && typeof LOBBY_LIST[parseInt(id)] !== undefined) {
		// 	hit = true;
		//}
		socket.emit('valID', hit2);
	});
	
	// sends the list of all player names to the player to display
	// called on entering a lobby
	socket.on('enterLobby', async (id) => {
		var pack = {};
		console.log('Player has entered lobby ', id);
		var game = await readfromDatabase(id);
		if(game === null){
			console.log("Problem");
			return;
		}
		var playerlist2 = game.players;
		//var playerlist = LOBBY_LIST[parseInt(id)].players;
		for (var i = 0; i < playerlist2.length; i++)
			pack[id] = [playerlist2[i].name, playerlist2[i].icon];
		socket.emit('updateNames', pack);
	});
	
	// called when a player updates their name or icon
	socket.on('playerName', async (data) =>
	{
		// package that will be sent to every player (display name + icon)
		var pack = {};

		// data[0] is player name, data[1] is game ID, data[2] is player icon
		gameID = parseInt(data[1]);
		let game = await readfromDatabase(gameID);
		if(game === null){
			console.log("Problem");
			return;
		}
		var playerlist2 = game.players;
		//var playerlist = LOBBY_LIST[gameID].players;

		// find this Player in the game's Player array, and update their name + icon
		for (var i = 0; i < playerlist2.length; i++)
		{
			var player = playerlist2[i];
			if (player.socketID == socket.id)
			{
				playerlist2[i].name = data[0];
				playerlist2[i].icon = data[2];
				game.players = playerlist2;
				await updateDatabase(game);
			}
			//add Players' info to pack
			pack[i] = [player.name, player.icon];
		}

		// send the package of player names + icons to every player (for display)
		for (var i = 0; i < playerlist2.length; i++)
		{
			if (playerlist2[i].socketID == socket.id)
				socket.emit('updateNames', pack);
			else 
				socket.to(playerlist2[i].socketID).emit('updateNames', pack); 
		}
	});
	
	socket.on('gameStarted', async (id) =>
	{
		//var playerlist = LOBBY_LIST[parseInt(id)].players;
		var game = await readfromDatabase(id);
		if(game === null){
			return;
		}
		var playerlist = game.players;
		for (var i = 0; i < playerlist.length; i++)
		{
			var player = playerlist[i];
			console.log('Player present in game: ', player);
			if (player.socketID === socket.id)
			{
				socket.emit('startGame', 0);
				console.log('reached here');
			}
			else {
				socket.to(player.socketID).emit('startGame', 0);
				console.log('reached here 2');
			}
			player.addCard(new Card('nope'));
			player.addCard(new Card('give'));
			playerlist[i] = player;
			sendHand(player.socketID, id, player.hand, i); 
		}
		game.players = playerlist;//
		await updateDatabase(game);//maybe put this inside the loop later
	});
	
	socket.on('cardDrawn', async (id) =>
	{
		// grab a Card from the backend TODO
		//var playerlist = LOBBY_LIST[parseInt(id)].players;
		let game = await readfromDatabase(id);
		if(game === null){
			return;
		}
		let playerlist = game.players;
		for (var i = 0; i < playerlist.length; i++)
		{
			// not sure
			sendHand(playerlist[0].socketID, parseInt(id), playerlist[0].hand, i); 
		}
	});
	
	socket.on('cardPlayed', async (id) =>
	{
		// play the Card that is given TODO
		//var playerlist = LOBBY_LIST[parseInt(id)].players;
		let game = await readfromDatabase(id);
		if(game === null){
			return;
		}
		let playerlist = game.players;
		for (var i = 0; i < playerlist.length; i++)
			sendHand(playerlist[i].socketID, parseInt(id), playerlist[i].hand, i); 
	});
	
	// sends one Player's hand to everyone
	async function sendHand(socketID, gameID, hand, elem) {
		var pack = { hand, elem };
		//var playerlist = LOBBY_LIST[parseInt(gameID)].players;
		let game = await readfromDatabase(gameID);
		if(game === null){
			return;
		}
		let playerlist = game.players;
		for (var i = 0; i < playerlist.length; i++)
		{
			if (playerlist[i].socketID == socketID)
				socket.emit('playerHand', pack);
			else
				socket.to(playerlist[i].socketID).emit('otherHand', pack);
		}
	}
	
});

const getApiAndEmit = socket => {
	socket.emit('Title', title);
};

// start express server on port 5000
http.listen(port, () => console.log(`Listening on port ${port}`));