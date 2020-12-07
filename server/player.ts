const Card = require ("./card.ts");

class Player {
	socketID;
	name;
	hand;
	pointTotal;
	isDead;
	icon;
	opponentIndex;
	lastPlayed;

	static fromFirestore(player){ //pass in a simple JSON object, it returns a player object
		let p = new Player(player.socketID, player.name, player.icon);
		p.pointTotal = player.pointTotal;
		p.isDead = player.isDead;
		p.hand = player.hand.map(c => Card.fromFirestore(c));
		p.opponentIndex = player.opponentIndex;
		p.lastPlayed = player.lastPlayed;
		return p;
		//add a modification to add back the functions and other things into socket.
	}

	constructor(socketID, name, icon) {
		this.socketID = socketID;
		this.name = name;
		this.pointTotal = 0;
		this.isDead = false;
		this.hand = [];
		this.icon = icon;
		this.opponentIndex = -1;
		this.lastPlayed = '';
	}

	toFirestore() {
		let temp = Object.assign({}, this);
		temp.hand = temp.hand.map(h => h.toFirestore());
		return temp;
		//add a modification to strip socket everything but data.
	}

	addCard(card) {
		let newCard = new Card(card.type);
		newCard.points = card.points;
		this.hand.push(newCard);
    }

	removeCard(card) {
		for (let i = 0; i < this.hand.length; i++) {
			if (this.hand[i].type === card.type && this.hand[i].points === card.points) {
				this.hand.splice(i, 1);
				return;
			}
		}
	}
}

module.exports = Player;