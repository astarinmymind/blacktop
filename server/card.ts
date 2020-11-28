class Card {
	type;
	points;

	public constructor(type) {
		this.type = type;
		this.points = 0;
		this.generateCardPoints();
	}

	toFirestore() {
		return Object.assign({},this);
	}

	generateCardPoints() {
		if (this.type === 'add') {
			this.points = Math.floor(Math.random() * 20);
		}
		else if (this.type === 'subtract') {
			this.points = -1 * Math.floor(Math.random() * 20);
		}
		else
			this.points = 0;
	}
}

export default Card;
