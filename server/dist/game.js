// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require('firebase/app');
//import firebase from '../node_modules/firebase/app';
// Add the Firebase products that you want to use
var auth = require('firebase/auth');
var store = require('firebase/firestore');
//Other classes
var Player = require("./player.ts");
var Card = require("./card.ts");
//A Game must have a unique id to prevent conflicts on the database. I suggest making the id equal to gameRooms.length()
//and then pushing the created game onto gameRooms.
//This way, the index of a game in gameRooms will be equal to it's id, which will be equal to it's ID in the database
var Game = /** @class */ (function () {
    function Game(id) {
        this.id = id;
        this.isFinalRound = false;
        this.isGameOver = false;
        this.players = new Array();
        this.existingPlayerIDs = new Array();
        this.mainDeck = new Array();
    }
    Game.prototype.toFirestore = function () {
        var temp = Object.assign({}, this);
        temp.players = temp.players.map(function (p) { return p.toFirestore(); });
        temp.mainDeck = temp.mainDeck.map(function (d) { return d.toFirestore(); });
        return temp;
    };
    Game.prototype.generateMainDeck = function (numberOfCards) {
        for (var i = 0; i < numberOfCards; i++) {
            this.mainDeck[i] = this.getRandomCard();
        }
    };
    Game.prototype.generatePlayerHands = function (numberOfCards) {
        for (var p = 0; p < this.players.length; p++) {
            for (var i = 0; i < numberOfCards; i++) {
                this.players[p].hand[i] = this.getRandomCard();
            }
        }
    };
    Game.prototype.getRandomCard = function () {
        var cardTypes = ['nope', 'give', 'steal', 'skip', 'add', 'subtract', "draw 2 from deck", "see the future"];
        var cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        var card = new Card(cardType);
        return card;
    };
    Game.prototype.connect = function (socket, name, icon) {
        var player = new Player(socket, name, icon);
        this.players.push(player);
        console.log("Player connected: " + socket.id);
    };
    Game.prototype.disconnect = function (socket) {
        var playerID = socket.id;
        this.players = this.players.filter(function (p) { return p.id !== playerID; });
    };
    Game.prototype.start = function () {
        this.generateMainDeck(50);
        this.generatePlayerHands(7);
        while (!this.isGameOver) {
            this.takeGameRound();
        }
        //emit some sort of message to clients that game is over, along with the winner
        //this.takeGameRound();
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
        updateDatabase(this);
    };
    Game.prototype.takePlayerTurn = function (player) {
        var card = null;
        // handle click?
        // ...
        // socket emit stuff?
        // retrieve card
        this.playCard(player, card);
        // handle click?
        // ...		
        // socket emit stuff?
        // retrieve cardType
        this.drawCard(player, this.mainDeck[0]); // get first card in main deck
        this.mainDeck.shift();
        this.mainDeck.push(this.getRandomCard());
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
    Game.prototype.playCard = function (player, card) {
        var cardType = card.type;
        // if Player does not want to play a card, cardType is null
        if (cardType == null)
            return;
        //Socket emit that the player played this card
        var nopePlayed = this.listenForNope();
        if (nopePlayed) {
            player.removeCard(card);
            return;
            //socket emit that someone said nope
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
        else if (cardType === "draw 2 from deck") {
            this.drawCard(player, this.mainDeck[0]); // get first card in main deck
            this.mainDeck.shift();
            this.mainDeck.push(this.getRandomCard());
            this.drawCard(player, this.mainDeck[0]); // get first card in main deck
            this.mainDeck.shift();
            this.mainDeck.push(this.getRandomCard());
        }
        else if (cardType === "see the future") {
            var cardstoDisplay = [this.mainDeck[0], this.mainDeck[1], this.mainDeck[2]];
            //TODO: use socket to emit ("showCard", cardstoDisplay to player.id )
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
    Game.prototype.findPlayerByID = function (socketID) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].socket.id === socketID)
                return this.players[i];
        }
        return null;
    };
    Game.prototype.listenForNope = function () {
        //if someone emits a nope event within 6 seconds
        //return true
        //else
        return false;
    };
    return Game;
}());
// TODO: more Game functions
// TODO: add functionality for when a player interrupts another's turn:
// for Example, Player 1 plays 'steal a card' from Player 2
// Player 2 can counter with 'nope' instantly.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Database functions
// Firestore data converter -> convert to and from firestore document to JSON object (Game)
var gameConverter = {
    toFirestore: function (Game) {
        return Game.toFirestore();
    },
    fromFirestore: function (snapshot, options) {
        var data = snapshot.data(options);
        var game = new Game(data.id);
        game.players = data.players;
        game.existingPlayerIDs = data.existingPlayerIDs;
        game.mainDeck = data.mainDeck;
        game.isGameOver = data.isGameOver;
        game.isFinalRound = data.isFinalRound;
        return game;
    }
};
//Add a game to the database
function addtoDatabase(game) {
    var db = firebase.firestore();
    db.collection('Games')
        .doc(game.id.toString()).set(gameConverter.toFirestore(game))
        .then(function (docRef) {
        console.log("Success");
        //console.log(docRef.id);
    })["catch"](function (error) {
        console.log("Error getting document:", error);
    });
}
//Update a game's status within the database
function updateDatabase(game) {
    var db = firebase.firestore();
    var doc = db.collection('Games').doc(game.id.toString());
    doc.get().then(function (doc) {
        if (doc.exists) {
            db.collection('Games').doc(game.id.toString()).set(gameConverter.toFirestore(game), { merge: false });
        }
        else {
            console.log("No such document");
        }
    })["catch"](function (error) {
        console.log("Error getting document: ", error);
    });
}
//Read from the database: this is mostly used as a check
function readfromDatabase(game) {
    var db = firebase.firestore();
    var id = game.id;
    var doc = db.collection('Games').doc(id.toString());
    doc
        .withConverter(gameConverter)
        .get().then(function (doc) {
        if (doc.exists) {
            var game = doc.data();
            console.log(game.toString());
            console.log(game.id);
        }
        else {
            console.log("No such document");
        }
    })["catch"](function (error) {
        console.log("Error getting document:", error);
    });
}
//export {Game, readfromDatabase, updateDatabase, addtoDatabase};
module.exports = { Game: Game, readfromDatabase: readfromDatabase, updateDatabase: updateDatabase, addtoDatabase: addtoDatabase };
