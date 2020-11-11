var Player = /** @class */ (function () {
    function Player(id, name) {
        this.id = id;
        this.name = name;
        this.pointTotal = 0;
        this.isDead = false;
    }
    Player.prototype.addCard = function (card) {
        this.hand.push(card);
    };
    Player.prototype.removeCard = function (card) {
        this.hand = this.hand.filter(function (c) { return c.id !== card.id; });
    };
    return Player;
}());
module.exports = Player;
//# sourceMappingURL=player.js.map