// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require('firebase/app');
//import firebase from '../node_modules/firebase/app';
// Add the Firebase products that you want to use
const auth = require('firebase/auth');
const store = require('firebase/firestore');
//Other classes
const Player = require("./player.ts");
const Card = require("./card.ts");

//A Game must have a unique id to prevent conflicts on the database. I suggest making the id equal to gameRooms.length()
//and then pushing the created game onto gameRooms.
//This way, the index of a game in gameRooms will be equal to it's id, which will be equal to it's ID in the database
class Game {
	id;
	players;
	mainDeck;
	isFinalRound;
	isGameOver;
	turnNumber;

	constructor(id) {
		this.id = id;
		this.isFinalRound = false
		this.isGameOver = false;
		this.players = new Array();
		this.mainDeck = new Array();
		this.turnNumber = 0;
	}

	toFirestore() {
		var temp = Object.assign({}, this)
		temp.players = temp.players.map(p => p.toFirestore());
		temp.mainDeck = temp.mainDeck.map(d => d.toFirestore());
		return temp;
	}

	generateMainDeck(numberOfCards) {
		for (let i = 0; i < numberOfCards; i++) {
			this.mainDeck[i] = this.getRandomCard();
		}
	}

	generatePlayerHands(numberOfCards) {
		for (let p = 0; p < this.players.length; p++) {
			let player = this.players[p];
			player.addCard(new Card('nope'));
			player.addCard(new Card('give'));
			for (let i = 0; i < numberOfCards; i++) {
				player.addCard(this.getRandomCard());
			}
		}
	}

	getRandomCard() {
		let cardTypes = ['nope', 'give', 'steal', 'skip', 'add', 'subtract', 'draw 2', 'see future'];
		let cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
		let card = new Card(cardType);
		return card;
	}

	connect(socketID, name, icon) {
		const player = new Player(socketID, name, icon);
		this.players.push(player);
		console.log("Player connected: " + socketID);
	}

	disconnect(socketID) {
		let playerID = socketID;
		this.players = this.players.filter(p => p.socketID !== playerID);
	}

	drawTopCard(player) {
		let card = this.mainDeck[0]; // get first card in main deck
		player.addCard(card);
		this.mainDeck.shift();
		this.mainDeck.push(this.getRandomCard());
	}

	specialAction(pointTotal) {
		switch (pointTotal) {
			case 10:
			// do stuff
			case 20:
			// do stuff
			//...
		}
	}
	transferCard( sender, reciever, card){
		this.players[sender].removeCard(card)
		this.players[reciever].addCard(card)
	}

	playCard(player, card, socket) {
		
		let cardType = card.type;
		console.log("Card played: ", card);
		player.removeCard(card);
		
		if (cardType === 'give' || cardType == 'steal') {
			let opponentIndices = [];
			for (let i = 0; i< this.players.length; i++){
				if(this.players[i].socketID!== socket.id)
				opponentIndices.push(i);
			}
			socket.emit("selectOpponent", opponentIndices)
		}
		
		else if (cardType === 'draw 2') {
			player.drawCard(this.mainDeck[0]); // get first card in main deck
			this.mainDeck.shift();
			this.mainDeck.push(this.getRandomCard());
			player.drawCard(player, this.mainDeck[0]); // get first card in main deck
			this.mainDeck.shift();
			this.mainDeck.push(this.getRandomCard());
		}

		else if (cardType === "see future") {
			let cardsToDisplay = [this.mainDeck[0], this.mainDeck[1], this.mainDeck[2]];
			socket.emit("See Future", cardsToDisplay)
		}

		else if (cardType === 'skip') { }
		else if (cardType === 'add' || cardType === 'subtract') {
			player.pointTotal += card.points;
		}

	}

	findPlayerByID(socketID) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].socket.id === socketID)
				return this.players[i];
		}
		return null;
	}

	logPlayers() {
		for (let i = 0; i < this.players.length; i++) {
			console.log("Player in game ", this.id, ": ", this.players[i]);
		}
	}
	
}

// TODO: more Game functions
// TODO: add functionality for when a player interrupts another's turn:
// for Example, Player 1 plays 'steal a card' from Player 2
// Player 2 can counter with 'nope' instantly.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Database functions

// Firestore data converter -> convert to and from firestore document to JSON object (Game)
var gameConverter = {
	toFirestore: function (Game) {
		return Game.toFirestore()
	},
	fromFirestore: function (snapshot, options) {
		const data = snapshot.data(options);
		let game = new Game(data.id);
		game.players = data.players.map(player => Player.fromFirestore(player)); //factory function;
		game.mainDeck = data.mainDeck.map(card => Card.fromFirestore(card));
		game.isGameOver = data.isGameOver;
		game.isFinalRound = data.isFinalRound;
		game.turnNumber = data.turnNumber;
		return game;
	}
}
//Add a game to the database
async function addtoDatabase(game) {
	var db = firebase.firestore();
	try {
		let docRef = await db.collection('Games')
			.doc(game.id.toString()).set(
				gameConverter.toFirestore(game)
			)
		console.log("Successful write to database");
		//console.log(docRef.id);
		return true;
	}
	catch (error) {
		console.log("Error getting document:", error);
		return false;
	}
}

//Update a game's status within the database
async function updateDatabase(game) {
	var db = firebase.firestore();
	const doc = db.collection('Games').doc(game.id.toString());
	try {
		let x = await doc.get()
		if (x.exists) {
			await db.collection('Games').doc(game.id.toString()).set(
				gameConverter.toFirestore(game),
				{ merge: false }
			)
			console.log("asdas");
			return true;
		} else {
			console.log("No such document")
			return false;
		}
	}
	catch (error) {
		console.log("Error getting document: ", error);
		return false;
	}
}
//Read from the database: this is mostly used as a check
async function readfromDatabase(id) {
	var db = firebase.firestore();
	var doc = db.collection('Games').doc(id.toString());
	try {
		let result = await doc.withConverter(gameConverter).get()
		if (result.exists) {
			var game = result.data();
			return game;
		} else {
			console.log("No such document")
			return null;
		}
	}
	catch (error) {
		console.log("Error getting document:", error);
		return null;
	}
}

//export {Game, readfromDatabase, updateDatabase, addtoDatabase};
module.exports = { Game, readfromDatabase, updateDatabase, addtoDatabase };