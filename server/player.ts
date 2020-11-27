﻿import Card = require("./card")
class Player {
	id: number;
	name: string;
	hand: Array<Card>;
	pointTotal: number;
	isDead: boolean;

	public constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
		this.pointTotal = 0;
		this.isDead = false;
		this.hand = [];
	}
	toFirestore(){
		var temp = Object.assign({},this);
		temp.hand = temp.hand.map(h => h.toFirestore());
		return temp;
	}

	addCard(card: Card): void {
		this.hand.push(card);
    }

	removeCard(card: Card): void {
		this.hand = this.hand.filter(c => (c.type !== card.type && c.points !== card.points));
	}
}

export = Player;