// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require('firebase/app');
//import firebase from '../node_modules/firebase/app';
// Add the Firebase products that you want to use
const auth = require('firebase/auth');
const store = require('firebase/firestore');
//Other classes
const Player = require('./player.ts');
const Card = require('./card.ts');

//A Game must have a unique id to prevent conflicts on the database. I suggest making the id equal to gameRooms.length()
//and then pushing the created game onto gameRooms.
//This way, the index of a game in gameRooms will be equal to it's id, which will be equal to it's ID in the database
class Game {
	id;
	players;
	mainDeck;
	isGameOver;
	turnNumber;
	skipTurnNumber;
	finalTurnNumber;

	constructor(id) {
		this.id = id;
		this.isGameOver = false;
		this.players = new Array();
		this.mainDeck = new Array();
		this.turnNumber = 0;
		this.skipTurnNumber = -1;
		this.finalTurnNumber = -1;
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
		let cardTypes = ['nope', 'give', 'steal', 'skip', 'add', 'add', 'add','add', 'subtract', 'subtract', 'draw 2', 'see future'];
		let cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
		let card = new Card(cardType);
		return card;
	}

	connect(socketID, name, icon) {
		const player = new Player(socketID, name, icon);
		this.players.push(player);
	}

	disconnect(socketID) {
		let playerID = socketID;
		this.players = this.players.filter(p => p.socketID !== playerID);
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

	transferCard(senderIndex, recipientIndex, card) {
		this.players[recipientIndex].addCard(card);
		this.players[senderIndex].removeCard(card);
	}

	playCard(playerIndex, card, socket, opponentIndex) {
		let cardType = card.type;
		let player = this.players[playerIndex];
		if (player.lastPlayed === 'give') {
			this.transferCard(playerIndex, player.opponentIndex, card);
			player.lastPlayed = '';
		}
		else if (cardType === 'nope') {
			player.removeCard(card);
			let lastPlayedCard = new Card(player.lastPlayed);
			lastPlayedCard.points = player.lastPlayedPoints;
			if (player.lastPlayed === 'steal') {
				this.transferCard(playerIndex, player.opponentIndex, player.hand.pop());
			}
			else if (player.lastPlayed === 'draw 2') {
				this.mainDeck.unshift(player.hand.pop());
				this.mainDeck.unshift(player.hand.pop());
			}
			console.log(player.lastPlayedPoints);
			player.pointTotal -= player.lastPlayedPoints;
			player.lastPlayed = '';
			player.lastPlayedPoints = 0;
			player.hand.push(lastPlayedCard);
		}
		else {
			player.removeCard(card);
			player.lastPlayed = cardType;
			player.lastPlayedPoints = card.points;
			if (cardType === 'give') {
				player.opponentIndex = opponentIndex;
			}
			else if (cardType === 'steal') {
				let opponentHand = this.players[opponentIndex].hand;
				let randomCard = opponentHand[Math.floor(Math.random() * opponentHand.length)];
				this.transferCard(opponentIndex, playerIndex, randomCard);
			}
			else if (cardType === 'skip') {
				this.skipTurnNumber = this.turnNumber + 1;
			}
			else if (cardType === 'draw 2') {
				player.addCard(this.mainDeck[0]); // get first card in main deck
				this.mainDeck.shift();
				this.mainDeck.push(this.getRandomCard());
				player.addCard(this.mainDeck[0]); // again, get first card in main deck
				this.mainDeck.shift();
				this.mainDeck.push(this.getRandomCard());
			}
			else if (cardType === 'see future') {
				let cardsToDisplay = [this.mainDeck[0], this.mainDeck[1], this.mainDeck[2]];
				socket.emit('seeFuture', cardsToDisplay)
			}
			else if (cardType === 'add' || cardType === 'subtract') {
				player.pointTotal += card.points;
				player.lastPlayedPoints = card.points;
				if (player.pointTotal >= 100) {
					player.isDead = true;
					console.log("player", player.name, "just died!")
					this.isGameOver = true;
					if (this.finalTurnNumber === -1)
						this.finalTurnNumber = Math.ceil(this.turnNumber / this.players.length + 1) * this.players.length;
				}
			}
		}
	}

	findWinnerIndex() {
		let maxScore = -10000;
		let winnerIndex = -1;
		for (let i = 0; i < this.players.length; i++) {
			if (!this.players[i].isDead && this.players[i].pointTotal > maxScore) {
				maxScore = this.players[i].pointTotal;
				winnerIndex = i;
			}
		}
		return winnerIndex;
	}

	findPlayerByID(socketID) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].socketID === socketID)
				return this.players[i];
		}
		return null;
	}

	logPlayers() {
		for (let i = 0; i < this.players.length; i++) {
			console.log(this.players[i]);
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
		game.turnNumber = data.turnNumber;
		game.skipTurnNumber = data.skipTurnNumber;
		game.finalTurnNumber = data.finalTurnNumber;
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
		console.log('Successful write to database.');
		return true;
	}
	catch (error) {
		console.log('Error getting document:', error);
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
			);
			return true;
		} else {
			console.log('updateDatabase failed: no such document.');
			return false;
		}
	}
	catch (error) {
		console.log('Error getting document: ', error);
		return false;
	}
}
//Read from the database: this is mostly used as a check
async function readfromDatabase(id) {
	var db = firebase.firestore();
	var doc = db.collection('Games').doc(id.toString());
	try {
		let result = await doc.withConverter(gameConverter).get();
		if (result.exists) {
			var game = result.data();
			return game;
		} else {
			console.log('readfromDatabase failed: no such document');
			return null;
		}
	}
	catch (error) {
		console.log('Error getting document:', error);
		return null;
	}
}

//export {Game, readfromDatabase, updateDatabase, addtoDatabase};
module.exports = { Game, readfromDatabase, updateDatabase, addtoDatabase };