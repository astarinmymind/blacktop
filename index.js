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

var interval;

var SOCKET_LIST = {};

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
			var socket = SOCKET_LIST[i];
	});
	
	
	// a lobby has been created by a player
	socket.on('makeLobby', async (id) => {	
		let game = new Game(parseInt(id)); // create a new Game associated with this lobby	
		game.connect(socket.id, "", 0); // connect first Player to the Game
		await addtoDatabase(game); // add to the database
		let result = await readfromDatabase(id);
		if (result === null)
			return;
	});
	
	// a player has joined an existing lobby
	socket.on('joinLobby', async (id) => {
		// console.log('Player has joined lobby ', id);
		let game = await readfromDatabase(id);
		if (game === null)
			return;
		// if the lobby is valid, connect the new Player to the associated Game, and update database.
		game.connect(socket.id, '', 0);
		socket.emit('playerIndex', game.players.length - 1);
		await updateDatabase(game);
	});
	
	// debug function
	socket.on('validId', async (id) => {
		let hit = await readfromDatabase(id);
		if(hit === null)
			hit = false;
		else
			hit = true;
		socket.emit('valID', hit);
	});
	
	// sends the list of all player names to the player to display
	// called on entering a lobby
	socket.on('enterLobby', async (id) => {
		let pack = {};
		// console.log('Player has entered lobby ', id);
		let game = await readfromDatabase(id);
		if(game === null) {
			console.log('Failed to retrieve Game instance ', id, ' from database.');
			return;
		}
		let playerlist = game.players;
		for (let i = 0; i < playerlist.length; i++)
			pack[i] = [playerlist[i].socketID, playerlist[i].name, playerlist[i].icon];
		socket.emit('updateNames', pack);
	});
	
	// called when a player updates their name or icon
	// data[0] is player name, data[1] is game ID, data[2] is player icon
	socket.on('playerName', async (data) =>
	{
		// package that will be sent to every player (display name + icon)
		let pack = {};
		let game = await readfromDatabase(parseInt(data[1]));
		if (game === null) {
			// console.log("Failed to retrieve Game instance ", id, " from database.");
			return;
		}
		let playerlist = game.players;
		// find this Player in the game's Player array, and update their name + icon
		for (let i = 0; i < playerlist.length; i++)
		{
			let player = playerlist[i];
			if (player.socketID == socket.id)
			{
				playerlist[i].name = data[0];
				playerlist[i].icon = data[2];
				game.players = playerlist;
				await updateDatabase(game);
			}
			//add Players' info to pack
			pack[i] = [playerlist[i].socketID, playerlist[i].name, playerlist[i].icon];
		}
		// send the package of player names + icons to every player (for display)
		for (let i = 0; i < playerlist.length; i++)
		{
			if (playerlist[i].socketID == socket.id)
				socket.emit('updateNames', pack);
			else 
				socket.to(playerlist[i].socketID).emit('updateNames', pack); 
		}
	});
	
	socket.on('gameStarted', async (id) =>
	{
		let game = await readfromDatabase(id);
		if (game === null)
			return;
		let playerlist = game.players;
		if (playerlist.length === 0)
			return;
		
		// game.start();
		game.generateMainDeck(50);
		game.generatePlayerHands(5);
		game.logPlayers();
		// TODO: move this to Game class?
		for (let i = 0; i < playerlist.length; i++)
		{
			let player = playerlist[i];
			if (player.socketID === socket.id)
				socket.emit('startGame', 0);
			else
				socket.to(player.socketID).emit('startGame', 0);
			sendHand(player.socketID, id, player.hand, i); 
		}
		await updateDatabase(game);
		 //maybe put this inside the loop later
	});
	
	socket.on('cardDrawn', async (gameID, index) =>
	{
		let game = await readfromDatabase(gameID);
		if (game === null)
			return;
		let player = game.players[index];
		if (player === null)
			return;

		let card = game.mainDeck[0]; // get first card in main deck
		game.players[index].hand.push(card);
		game.mainDeck.shift();

		await updateDatabase(game);

		let playerlist = game.players;
		for (let i = 0; i < playerlist.length; i++)
			sendHand(playerlist[i].socketID, parseInt(gameID), playerlist[i].hand, i); 

	});
	
	socket.on('cardPlayed', async (id, playerIndex, card, opponentIndex) =>
	{
		let game = await readfromDatabase(id);
		let playerlist = game.players;

		let player = playerlist[playerIndex];
		let lastPlayed = player.lastPlayed;
		let opponentName = '';
		if (player.opponentIndex >= 0)
			opponentName = playerlist[player.opponentIndex].name;

		let winnerIndex = game.playCard(playerIndex, card, socket, opponentIndex);
		//if (winnerIndex !== -1) 
			//socket.emit('results', winnerIndex);
		await updateDatabase(game);
		
		let msg = "";
		if (lastPlayed === 'give')
            msg = player.name + " gave '" + card.type + "' to " + opponentName + ".\n";
		else if (lastPlayed === 'steal')
            msg = player.name + " stole '" + card.type + "' from " + opponentName + ".\n";
		else
            msg = player.name + " played '" + card.type + "'.\n";
		
		let pack = [];
		for (let i = 0; i < playerlist.length; i++)
		{
			sendHand(playerlist[i].socketID, parseInt(id), playerlist[i].hand, i);
			pack.push(playerlist[i].pointTotal);
		}
		for (let i = 0; i < playerlist.length; i++)
		{
			if (playerlist[i].socketID == socket.id)
			{
				socket.emit('allScores', pack);
				socket.emit('eventNotification', msg);
			}
			else
			{
				socket.to(playerlist[i].socketID).emit('allScores', pack);
				socket.to(playerlist[i].socketID).emit('eventNotification', msg);
			}
		}
	});
	
	socket.on('turnEnded', async(id, index, endTurnNotification) =>
	{
		let game = await readfromDatabase(id);
		game.turnNumber++;
		if (game.turnNumber % game.players.length === 0)
		{
			if (game.isFinalRound)
			{
				let deadPlayers = game.players.filter(p => p.isDead);
				socket.emit('finalRound', deadPlayers);
			}
		}
		await updateDatabase(game);
		for (let i = 0; i < game.players.length; i++)
		{
			if (i == index) {
				socket.emit('turnCount', game.turnNumber);
				socket.emit('endTurnNotification', endTurnNotification)
			}
			else {
				socket.to(game.players[i].socketID).emit('turnCount', game.turnNumber);
				socket.to(game.players[i].socketID).emit('endTurnNotification', endTurnNotification)
			}
		}
	});
	
	// sends one Players hand to itself
	async function sendHand(socketID, gameID, hand, elem) {
		let pack = {hand, elem};
		let game = await readfromDatabase(gameID);
		if (game === null)
			return;
		let playerlist = game.players;
		for (let i = 0; i < playerlist.length; i++)
		{
			if (playerlist[i].socketID == socketID) {
				if (socketID === socket.id) {
					socket.emit('playerHand', pack);
				}
				socket.to(playerlist[i].socketID).emit('playerHand', pack);
			}
			else {
				socket.to(playerlist[i].socketID).emit('otherHand', pack);
			}
		}
	}
});

const getApiAndEmit = socket => {
	socket.emit('Title', "Don't Draw Card");
};

// start express server on port 5000
http.listen(port, () => console.log(`Listening on port ${port}`));