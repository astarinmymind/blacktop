class Card {
	type: string;
	points: number;

	public constructor(type: string) {
		this.type = type;
		this.points = 0;
		this.generateCardPoints();
	}
	toFirestore(){
		return Object.assign({},this);
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
