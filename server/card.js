var Card = /** @class */ (function () {
    function Card(id, type) {
        this.id = id;
        this.type = type;
        this.generateCardPoints();
        this.matchImageID;
    }
    Card.prototype.generateCardPoints = function () {
        if (this.type === 'add') {
            var points = Math.floor(Math.random() * 20);
            this.points = points;
        }
        else if (this.type === 'subtract') {
            var points = -1 * Math.floor(Math.random() * 20);
            this.points = points;
        }
        else
            this.points = 0;
    };
    Card.prototype.matchImageID = function () {
        // TODO: match image ID based on type & points
    };
    return Card;
}());
module.exports = Card;
//# sourceMappingURL=card.js.map