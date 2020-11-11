class Game {
	// TODO: figure out the class of IO lol
	io;
	players: Array<Player>;
	existingPlayerIDs: Array<number>;
	mainDeck: Array<Card>;
	existingCardIDs: Array<number>;
	isFinalRound: boolean;
	isGameOver: boolean;
	timer: number;
	
	public constructor(io) {
		this.io = io;
		this.generateDeck(50);
		this.isFinalRound = false
		this.isGameOver = false;
		this.timer = 10000;
    }

	generateDeck(numberOfCards: number): void {
		for (let i = 0; i < numberOfCards; i++) {
			this.mainDeck.push(this.getRandomCard());
        }
    }

	getRandomCard(): Card {
		let cardTypes: Array<string> = ['nope', 'give', 'steal', 'skip', 'add', 'subtract'];
		let cardType: string = cardTypes[Math.floor(Math.random() * cardTypes.length)];
		let cardID: number = 1000 + this.existingCardIDs.length;
		// keep track of existing card IDs
		this.existingCardIDs.push(cardID);
		let card: Card = new Card(cardID, cardType);
		return card;
	}

	addPlayer(id: number, name: string): void {
		const player = new Player(id, name);
		for (let i = 0; i < 7; i++) {
			player.hand.push(this.getRandomCard());
        }
		this.players.push(player);
		// return player;
	}

	connect(socket): void {
		this.addPlayer(socket.id, socket.name);
	}

	disconnect(socket): void {
		let playerID: number = socket.id;
		this.players = this.players.filter(p => p.id !== playerID);
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
		// retrieve card
		this.playCard(player, card);

		// handle click
		// ...		
		// retrieve cardType
		this.drawCard(player, card);
		this.mainDeck.pop();

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

	// TODO: put this function in Game class or elsewhere
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

	findPlayerByID(playerID: number): Player {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].id === playerID)
				return this.players[i];
		}
		return null;
    }
}

// TODO: more Game functions
// TODO: add functionality for when a player interrupts another's turn:
	// for Example, Player 1 plays 'steal a card' from Player 2
	// Player 2 can /ounter with 'nope' instantly.


module.exports = Game;