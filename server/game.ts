import Player = require("./player")
import Card = require("./card")
class Game {
	// TODO: figure out the class of IO lol
	io;
	players: Array<Player>;
	existingPlayerIDs: Array<number>;
	mainDeck: Array<Card>;
	isFinalRound: boolean;
	isGameOver: boolean;
	
	public constructor(io) {
		this.io = io;
		this.isFinalRound = false
		this.isGameOver = false;
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
		let cardTypes: Array<string> = ['nope', 'give', 'steal', 'skip', 'add', 'subtract'];
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
		this.takeGameRound();
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
		if (cardType === 'nope') {
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

}

// TODO: more Game functions
// TODO: add functionality for when a player interrupts another's turn:
	// for Example, Player 1 plays 'steal a card' from Player 2
	// Player 2 can counter with 'nope' instantly.


export = Game;