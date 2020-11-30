const Card = require ("./card.ts");

class Player {
	socketID;
	name;
	hand;
	pointTotal;
	isDead;
	icon;

	static fromFirestore(player){ //pass in a simple JSON object, it returns a player object
		let p = new Player(player.socketID, player.name, player.icon);
		p.pointTotal = player.pointTotal;
		p.isDead = player.isDead;
		p.hand = player.hand.map(c => Card.fromFirestore(c));
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
	}

	toFirestore() {
		var temp = Object.assign({}, this);
		temp.hand = temp.hand.map(h => h.toFirestore());
		return temp;
		//add a modification to strip socket everything but data.
	}

	addCard(card) {
		this.hand.push(card);
    }

	removeCard(card) {
		this.hand = this.hand.filter(c => (c.type !== card.type && c.points !== card.points));
	}
}

module.exports = Player;