require("./card.ts");
var Player = /** @class */ (function () {
    function Player(socket, name, icon) {
        this.socket = socket;
        this.name = name;
        this.pointTotal = 0;
        this.isDead = false;
        this.hand = [];
        this.icon = icon;
    }
    Player.prototype.toFirestore = function () {
        var temp = Object.assign({}, this);
        temp.hand = temp.hand.map(function (h) { return h.toFirestore(); });
        return temp;
    };
    Player.prototype.addCard = function (card) {
        this.hand.push(card);
    };
    Player.prototype.removeCard = function (card) {
        this.hand = this.hand.filter(function (c) { return (c.type !== card.type && c.points !== card.points); });
    };
    return Player;
}());
module.exports = Player;
