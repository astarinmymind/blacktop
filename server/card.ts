class Card {
	id: number;
	type: string;
	points: number;
	imgID: number;

	public constructor(id: number, type: string) {
		this.id = id;
		this.type = type;
		this.generateCardPoints();
		this.matchImageID;
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

	matchImageID() {
		// TODO: match image ID based on type & points
	}
}

module.exports = Card;
