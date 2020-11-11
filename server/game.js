var Game = /** @class */ (function () {
    function Game(io) {
        this.io = io;
        this.generateDeck(50);
        this.isFinalRound = false;
        this.isGameOver = false;
        this.timer = 10000;
    }
    Game.prototype.generateDeck = function (numberOfCards) {
        for (var i = 0; i < numberOfCards; i++) {
            this.mainDeck.push(this.getRandomCard());
        }
    };
    Game.prototype.getRandomCard = function () {
        var cardTypes = ['nope', 'give', 'steal', 'skip', 'add', 'subtract'];
        var cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        var cardID = 1000 + this.existingCardIDs.length;
        // keep track of existing card IDs
        this.existingCardIDs.push(cardID);
        var card = new Card(cardID, cardType);
        return card;
    };
    Game.prototype.addPlayer = function (id, name) {
        var player = new Player(id, name);
        for (var i = 0; i < 7; i++) {
            player.hand.push(this.getRandomCard());
        }
        this.players.push(player);
        // return player;
    };
    Game.prototype.connect = function (socket) {
        this.addPlayer(socket.id, socket.name);
    };
    Game.prototype.disconnect = function (socket) {
        var playerID = socket.id;
        this.players = this.players.filter(function (p) { return p.id !== playerID; });
    };
    Game.prototype.takeGameRound = function () {
        if (this.isGameOver)
            return;
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (!player.isDead)
                this.takePlayerTurn(player);
        }
        if (this.isFinalRound) {
            this.isGameOver = true;
            return;
        }
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.isDead)
                this.isFinalRound = true;
        }
    };
    Game.prototype.takePlayerTurn = function (player) {
        var card = null;
        // handle click?
        // ...
        // retrieve card
        this.playCard(player, card);
        // handle click
        // ...		
        // retrieve cardType
        this.drawCard(player, card);
        this.mainDeck.pop();
        if (player.pointTotal >= 100) {
            player.isDead = true;
            return;
        }
        if (player.pointTotal % 10 == 0)
            this.specialAction(player.pointTotal);
    };
    Game.prototype.specialAction = function (pointTotal) {
        switch (pointTotal) {
            case 10:
            // do stuff
            case 20:
            // do stuff
            //...
        }
    };
    // TODO: put this function in Game class or elsewhere
    Game.prototype.playCard = function (player, card) {
        var cardType = card.type;
        // if Player does not want to play a card, cardType is null
        if (cardType == null)
            return;
        if (cardType === 'nope') {
            // TODO
            // special case as nope card can be used at random times
        }
        else if (cardType === 'give') {
            // TODO: handle click
            // current Player selects Card from his/her deck
            // and selects opponent to give Card to
            var selectedCard = null;
            var opponent = null;
            player.removeCard(selectedCard);
            opponent.addCard(selectedCard);
        }
        else if (cardType === 'steal') {
            // TODO: handle click
            // current Player selects opponent to steal Card from
            // and selects desired Card from opponent’s deck
            var selectedCard = null;
            var opponent = null;
            opponent.removeCard(selectedCard);
            player.addCard(selectedCard);
        }
        else if (cardType === 'skip') { }
        else if (cardType === 'add' || cardType === 'subtract') {
            player.pointTotal += card.points;
        }
        player.removeCard(card);
    };
    Game.prototype.drawCard = function (player, card) {
        if (card.type === 'bomb') {
            player.isDead = true;
            // TODO: send message to Game
        }
        else {
            player.addCard(card);
        }
    };
    Game.prototype.findPlayerByID = function (playerID) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id === playerID)
                return this.players[i];
        }
        return null;
    };
    return Game;
}());
// TODO: more Game functions
// TODO: add functionality for when a player interrupts another's turn:
// for Example, Player 1 plays 'steal a card' from Player 2
// Player 2 can /ounter with 'nope' instantly.
module.exports = Game;
//# sourceMappingURL=game.js.map