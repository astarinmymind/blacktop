﻿// Firebase App (the core Firebase SDK) is always required and
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
	
	constructor(id) {
		this.id = id;
		this.isFinalRound = false
		this.isGameOver = false;
		this.players = new Array();
		this.mainDeck = new Array();
	}

	toFirestore() {
		var temp =  Object.assign({},this)
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
			for (let i = 0; i < numberOfCards; i++) {
				this.players[p].hand[i] = this.getRandomCard();
            }
        }
    }

	getRandomCard() {
		let cardTypes = ['nope', 'give', 'steal', 'skip', 'add', 'subtract', "draw 2 from deck", "see the future"];
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

	start() {
		this.generateMainDeck(50);
		this.generatePlayerHands(7);
		while(!this.isGameOver){
			this.takeGameRound();
		}
		//emit some sort of message to clients that game is over, along with the winner
		//this.takeGameRound();
    }

	takeGameRound() {
		if (this.isGameOver)
			return;
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (!player.isDead)
				this.takePlayerTurn(player);
		}

		if (this.isFinalRound) {
			this.isGameOver = true;
			return;
		}

		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (player.isDead)
				this.isFinalRound = true;
		}
		updateDatabase(this);
	}

	takePlayerTurn(player){

		let card = null;
		// handle click?
		// ...
		// socket emit stuff?
		// retrieve card
		this.playCard(player, card);

		// handle click?
		// ...		
		// socket emit stuff?
		// retrieve cardType
		this.drawCard(player, this.mainDeck[0]); // get first card in main deck
		this.mainDeck.shift();
		this.mainDeck.push(this.getRandomCard());

		if (player.pointTotal >= 100) {
			player.isDead = true;
			return;
		}

		if (player.pointTotal % 10 == 0)
			this.specialAction(player.pointTotal);
	}

	specialAction(pointTotal){
		switch (pointTotal) {
			case 10:
				// do stuff
			case 20:
				// do stuff
			//...
        }
	}


	playCard(player, card) {
		let cardType = card.type;
		// if Player does not want to play a card, cardType is null
		if (cardType == null)
			return;
		//Socket emit that the player played this card
		let nopePlayed = this.listenForNope();
		if(nopePlayed){
			player.removeCard(card)
			return;
			//socket emit that someone said nope
			// TODO
			// special case as nope card can be used at random times
		}
		else if (cardType === 'give') {
			// TODO: handle click
			// current Player selects Card from his/her deck
			// and selects opponent to give Card to
			let selectedCard = null;
			let opponent = null;
			player.removeCard(selectedCard);
			opponent.addCard(selectedCard);
		}
		else if(cardType === "draw 2 from deck"){
			this.drawCard(player, this.mainDeck[0]); // get first card in main deck
			this.mainDeck.shift();
			this.mainDeck.push(this.getRandomCard());
			this.drawCard(player, this.mainDeck[0]); // get first card in main deck
			this.mainDeck.shift();
			this.mainDeck.push(this.getRandomCard());
		}
		else if(cardType === "see the future"){
			let cardstoDisplay = [this.mainDeck[0], this.mainDeck[1], this.mainDeck[2]];
			//TODO: use socket to emit ("showCard", cardstoDisplay to player.id )
		}
		else if (cardType === 'steal') {
			// TODO: handle click
			// current Player selects opponent to steal Card from
			// and selects desired Card from opponent’s deck
			let selectedCard = null;
			let opponent = null;
			opponent.removeCard(selectedCard);
			player.addCard(selectedCard)
		}
		else if (cardType === 'skip') { }
		else if (cardType === 'add' || cardType === 'subtract') {
			player.pointTotal += card.points;
		}
		player.removeCard(card);
	}

	drawCard(player, card) {
		if (card.type === 'bomb') {
			player.isDead = true;
			// TODO: send message to Game
		}
		else {
			player.addCard(card);
		}
	}

	findPlayerByID(socketID) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].socket.id === socketID)
				return this.players[i];
		}
		return null;
	}
	listenForNope(){
	//if someone emits a nope event within 6 seconds
		//return true
	//else
		return false;
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
    toFirestore: function(Game) {
        return Game.toFirestore()
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        let game = new Game(data.id);
        game.players = data.players.map(player => Player.fromFirestore(player)); //factory function;
        game.mainDeck = data.mainDeck.map(card => Card.fromFirestore(card));
        game.isGameOver = data.isGameOver;
        game.isFinalRound = data.isFinalRound
        return game;
    }
}
//Add a game to the database
async function addtoDatabase(game){
	var db = firebase.firestore();
	try{
    	let docRef = await db.collection('Games')
    	.doc(game.id.toString()).set(
    		gameConverter.toFirestore(game)
    	)
    	console.log("Success");
		console.log(docRef.id);
		return true;
	}
    catch ( error ) {
		console.log("Error getting document:", error);
		return false;
    }
}

//Update a game's status within the database
async function updateDatabase(game){
    var db = firebase.firestore();
	const doc = db.collection('Games').doc(game.id.toString());
	try{
    	let x = await doc.get()
    	if(x.exists){
        	await db.collection('Games').doc(game.id.toString()).set(
            	gameConverter.toFirestore(game),
            	{merge: false}
			)
			return true;
    	}else{
			console.log("No such document")
			return false;
		}
	}
	catch ( error ) {
		console.log("Error getting document: " ,error);
		return false;
    }
}
//Read from the database: this is mostly used as a check
async function readfromDatabase(id){
    var db = firebase.firestore();
	var doc = db.collection('Games').doc(id.toString());
	try{
    	let result = await doc.withConverter(gameConverter).get()
    	if(result.exists){
        	var game = result.data();
			return game;
    	}else{
			console.log("No such document")
			return null;
    	}
	}
	catch ( error ) {
		console.log("Error getting document:", error);
		return null;
    }
}

//export {Game, readfromDatabase, updateDatabase, addtoDatabase};
module.exports = {Game, readfromDatabase, updateDatabase, addtoDatabase};