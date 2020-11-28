const Card = require("./card")
class Player {
	id;
	name;
	hand;
	pointTotal;
	isDead;

	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.pointTotal = 0;
		this.isDead = false;
		this.hand = [];
	}

	toFirestore() {
		var temp = Object.assign({}, this);
		temp.hand = temp.hand.map(h => h.toFirestore());
		return temp;
	}

	addCard(card): void {
		this.hand.push(card);
    }

	removeCard(card): void {
		this.hand = this.hand.filter(c => (c.type !== card.type && c.points !== card.points));
	}
}

module.exports = Player;