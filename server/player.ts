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
	}

	addCard(card: Card): void {
		this.hand.push(card);
    }

	removeCard(card: Card): void {
		this.hand = this.hand.filter(c => c.id !== card.id);
	}
}

module.exports = Player;