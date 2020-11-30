const Card = require ("./card.ts");

class Player {
	socket;
	name;
	hand;
	pointTotal;
	isDead;
	icon;

	constructor(socket, name, icon) {
		this.socket = socket;
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
	}

	addCard(card) {
		this.hand.push(card);
    }

	removeCard(card) {
		this.hand = this.hand.filter(c => (c.type !== card.type && c.points !== card.points));
	}
}

module.exports = Player;