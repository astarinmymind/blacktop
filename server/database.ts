// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
//const firebase = require('firebase/app');
import firebase from '../node_modules/firebase/app';
// Add the Firebase products that you want to use
import auth = require('firebase/auth');
import store = require('firebase/firestore');
//Add other classes that will be used
import Game = require('./game');

// Firestore data converter -> convert to and from firestore document to JSON object (Game)
var gameConverter = {
    toFirestore: function(Game) {
        return Game.toFirestore()
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        let game:Game = new Game( data.io, data.id); //TODO: Change o to whatever io is.
        game.players = data.players;
        game.existingPlayerIDs = data.existingPlayerIDs;
        game.mainDeck = data.mainDeck;
        game.isGameOver = data.isGameOver;
        game.isFinalRound = data.isFinalRound
        return game;
    }
}
//Add a game to the database
function addtoDatabase(game):void{
    var db = firebase.firestore();
    db.collection('Games')
    .doc(game.id.toString()).set(
    gameConverter.toFirestore(game)
    )
    .then(function(docRef){
    console.log("Success");
    //console.log(docRef.id);
    })
    .catch(function(error) {
    console.log("Error getting document:", error);
    });
}

//Update a game's status within the database
function updateDatabase(game):void{
    var db = firebase.firestore();
    const doc = db.collection('Games').doc(game.id.toString());
    doc.get().then(function(doc){
    if(doc.exists){
        db.collection('Games').doc(game.id.toString()).set(
            gameConverter.toFirestore(game),
            {merge: false}
        )
    }else{
        console.log("No such document")
    }
    }).catch(function(error){
    console.log("Error getting document: " ,error);
    })
}
//Read from the database: this is mostly used as a check
function readfromDatabase(game): void{
    var db = firebase.firestore();
    var id = game.id;
    var doc = db.collection('Games').doc(id.toString());
    doc
    .withConverter(gameConverter)
    .get().then(function(doc){
    if(doc.exists){
        var game = doc.data();
        console.log(game.toString());
        console.log(game.id);
        }else{
        console.log("No such document")
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

export = readfromDatabase; updateDatabase;  addtoDatabase;