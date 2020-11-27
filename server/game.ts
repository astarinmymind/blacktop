// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
//const firebase = require('firebase/app');
import firebase from '../node_modules/firebase/app';
// Add the Firebase products that you want to use
import auth = require('firebase/auth');
import store = require('firebase/firestore');
//Other classes
import Player = require("./player")
import Card = require("./card")
//A Game must have a unique id to prevent conflicts on the database. I suggest making the id equal to gameRooms.length()
//and then pushing the created game onto gameRooms.
//This way, the index of a game in gameRooms will be equal to it's id, which will be equal to it's ID in the database
class Game {
	// TODO: figure out the class of IO lol
	io;
	players: Array<Player>;
	existingPlayerIDs: Array<number>;
	mainDeck: Array<Card>;
	isFinalRound: boolean;
	isGameOver: boolean;
	id: number;
	
	public constructor(io, id) {
		this.io = io;
		this.isFinalRound = false
		this.isGameOver = false;
		this.players = [];
		this.existingPlayerIDs = [];
		this.mainDeck = [];
		this.id = id;
	}

	toFirestore(){
		var temp =  Object.assign({},this)
		temp.players = temp.players.map(p => p.toFirestore());
		temp.mainDeck = temp.mainDeck.map(d => d.toFirestore());
		return temp;
	}

	generateMainDeck(numberOfCards: number): void {
		for (let i = 0; i < numberOfCards; i++) {
			this.mainDeck.push(this.getRandomCard());
        }
	}

	generatePlayerHands(numberOfCards: number): void {
		for (let p = 0; p < this.players.length; p++) {
			for (let i = 0; i < numberOfCards; i++) {
				this.players[p].hand.push(this.getRandomCard());
            }
        }
    }

	getRandomCard(): Card {
		let cardTypes: Array<string> = ['nope', 'give', 'steal', 'skip', 'add', 'subtract', "draw 2 from deck", "see the future"];
		let cardType: string = cardTypes[Math.floor(Math.random() * cardTypes.length)];
		let card: Card = new Card(cardType);
		return card;
	}

	connect(socket, name): void {
		const player = new Player(socket.id, name);
		this.players.push(player);
		console.log("Player connected: " + socket.id);
	}

	disconnect(socket): void {
		let playerID: number = socket.id;
		this.players = this.players.filter(p => p.id !== playerID);
	}

	start(): void {
		this.generateMainDeck(50);
		this.generatePlayerHands(7);
		while(!this.isGameOver){
			this.takeGameRound();
		}
		//emit some sort of message to clients that game is over, along with the winner
		//this.takeGameRound();
    }

	takeGameRound(): void {
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

	takePlayerTurn(player: Player): void {

		let card: Card = null;
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

	specialAction(pointTotal: number): void {
		switch (pointTotal) {
			case 10:
				// do stuff
			case 20:
				// do stuff
			//...
        }
	}


	playCard(player: Player, card: Card) {
		let cardType: string = card.type;
		// if Player does not want to play a card, cardType is null
		if (cardType == null)
			return;
		//Socket emit that the player played this card
		let nopePlayed: boolean = this.listenForNope();
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
			let selectedCard: Card = null;
			let opponent: Player = null;
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
			let cardstoDisplay: Array<Card> = [this.mainDeck[0], this.mainDeck[1], this.mainDeck[2]];
			//TODO: use socket to emit ("showCard", cardstoDisplay to player.id )
		}
		else if (cardType === 'steal') {
			// TODO: handle click
			// current Player selects opponent to steal Card from
			// and selects desired Card from opponent’s deck
			let selectedCard: Card = null;
			let opponent: Player = null;
			opponent.removeCard(selectedCard);
			player.addCard(selectedCard)
		}
		else if (cardType === 'skip') { }
		else if (cardType === 'add' || cardType === 'subtract') {
			player.pointTotal += card.points;
		}
		player.removeCard(card);
	}

	drawCard(player: Player, card: Card) {
		if (card.type === 'bomb') {
			player.isDead = true;
			// TODO: send message to Game
		}
		else {
			player.addCard(card);
		}
	}

	findPlayerByID(socketID: number): Player {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].id === socketID)
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
        let game:Game = new Game( data.io, data.id); //TODO: Change o to whatever io is.
        game.players = data.players;
        game.existingPlayerIDs = data.existingPlayerIDs;
        game.mainDeck = data.mainDeck;
        game.isGameOver = data.isGameOver;
        game.isFinalRound = data.isFinalRound
        return game;
    }
}
//Add a game to the database
function addtoDatabase(game):void{
    var db = firebase.firestore();
    db.collection('Games')
    .doc(game.id.toString()).set(
    gameConverter.toFirestore(game)
    )
    .then(function(docRef){
    console.log("Success");
    //console.log(docRef.id);
    })
    .catch(function(error) {
    console.log("Error getting document:", error);
    });
}

//Update a game's status within the database
function updateDatabase(game):void{
    var db = firebase.firestore();
    const doc = db.collection('Games').doc(game.id.toString());
    doc.get().then(function(doc){
    if(doc.exists){
        db.collection('Games').doc(game.id.toString()).set(
            gameConverter.toFirestore(game),
            {merge: false}
        )
    }else{
        console.log("No such document")
    }
    }).catch(function(error){
    console.log("Error getting document: " ,error);
    })
}
//Read from the database: this is mostly used as a check
function readfromDatabase(game): void{
    var db = firebase.firestore();
    var id = game.id;
    var doc = db.collection('Games').doc(id.toString());
    doc
    .withConverter(gameConverter)
    .get().then(function(doc){
    if(doc.exists){
        var game = doc.data();
        console.log(game.toString());
        console.log(game.id);
        }else{
        console.log("No such document")
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

export = Game; readfromDatabase; updateDatabase;  addtoDatabase;
//export = Game;