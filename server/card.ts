class Card {
	type: string;
	points: number;

	public constructor(id: number, type: string) {
		this.type = type;
		this.generateCardPoints();
	}

	generateCardPoints() {
		if (this.type === 'add') {
			let points: number = Math.floor(Math.random() * 20);
			this.points = points;
		}
		else if (this.type === 'subtract') {
			let points: number = -1 * Math.floor(Math.random() * 20);
			this.points = points;
		}
		else
			this.points = 0;
	}
}

export = Card;
