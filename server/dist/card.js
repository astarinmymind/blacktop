var Card = /** @class */ (function () {
    function Card(type) {
        this.type = type;
        this.points = 0;
        this.generateCardPoints();
    }
    Card.prototype.toFirestore = function () {
        return Object.assign({}, this);
    };
    Card.prototype.generateCardPoints = function () {
        if (this.type === 'add') {
            this.points = Math.floor(Math.random() * 20);
        }
        else if (this.type === 'subtract') {
            this.points = -1 * Math.floor(Math.random() * 20);
        }
        else
            this.points = 0;
    };
    return Card;
}());
module.exports = Card;
