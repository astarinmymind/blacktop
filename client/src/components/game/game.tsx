/*
Notes: 
  -useObserver: used to observe values from store
  -React Fragment (notation: <> </> )  
    - allows component to return multiple elements
    - let you group a list of children without adding extra nodes to the DOM
*/

// import { CardStore } from "../card/CardStore";
  
//export const Game = () => {
import React from "react";
import { usePlayerStore } from '../player/player';
import { useObserver } from 'mobx-react-lite';
import { Card } from '../card/card';
import { Board } from '../board/board';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link } from "react-router-dom";
import './game.css';
import NopeCard from '../../images/NOPE.png';
import SkipCard from '../../images/SKIP.png';
import AddCard from '../../images/ADD1.png';
import SubCard from '../../images/SUB1.png';
import DrawCard from '../../images/DRAW.png';
import GiveCard from '../../images/GIVE.png';
import SeeCard from '../../images/SEE.png';
import TestLogo from '../../images/TestLogo.png';
import ChalkLine from '../../images/ChalkLine.png';
import Brickshay from '../../images/Brickshay.gif'

import GameService from '../../services/GameService';
import { getPositionOfLineAndCharacter } from "typescript";

const gs = new GameService();

//Just a random ID i used to test that each client was different
// var id = Math.floor(Math.random() * 100);

//address of the server
export const Game = () => {
	//this is syntax I use to set variables, setTitle being the way to change them

  // gets store
  // const {cardStore} = useCardStore()
  const {playerStore} = usePlayerStore();
  console.log(playerStore);

  // console.log(cardStore)

  // emits socket event that player has pressed start game
  function startGame() 
  {
    gs.socket.emit("gameStarted", playerStore.lobbyId);
  }

  // emits socket event that player has pressed draw card
  function cardDrawn() 
  {
    gs.socket.emit("cardDrawn", playerStore.lobbyId, playerStore.currentPlayer.index);
    console.log("card drawn");
  }

  // emits socket event that player has ended their turn 
  function turnEnded() 
  {
    gs.socket.emit("turnEnded", playerStore.lobbyId, playerStore.currentPlayer.playerId);
    console.log("turn ended");
  }

  function setImage(cardname) 
  {
    console.log(cardname.type)
    switch (cardname.type) {
        case "nope":
            return NopeCard;
        case "add":
            return AddCard;
        case "subtract":
            return SubCard;
        case "give":
            return GiveCard;
        case "see future":
            return SeeCard;
        case "draw 2":
            return DrawCard;
        case "skip":
            return SkipCard;
        default: 
            break;
    }
    return;
  }

  function sendNotification(event: string) 
  {
    console.log('toast message')
    switch (event) {
      case "nopeEvent":
          break;
      case "giveEvent":
          break;
      case "seefutureEvent":
          break;
      default: 
          break;
    }
  }
   
   const [gameEvent, setGameEvent] = React.useState({});
   const [lastFive, setLastFive] = React.useState([{}, {}, {}, {}, {}]);
   const [victorIndex, setVictorIndex] = React.useState(0);
   const [gameFinished, setGameFinished] = React.useState(false);
   const [dummy, setDummy] = React.useState({});
   React.useEffect(() => {

    // @NICK: update player hand after draw/play Card Event
    gs.socket.on("updatePlayerHand", function(data) {
        console.log("this is updating the players hand")
        playerStore.playerHand = data;
        setDummy({});
    });

    // @NICK: update player points 
    gs.socket.on("updatePlayerPoints", function(data) {
      console.log("this is updating the players points")
      playerStore.point = data;
      setDummy({});
    });

    // @NICK: event notification: nope, give, see, draw event
    gs.socket.on("eventNotification", function(data) {
        console.log(data)
        setDummy({});
    });

    // @NICK: last card played for display
    gs.socket.on("lastCardPlayed", function(data) {
      setLastFive([data, lastFive[0], lastFive[1], lastFive[2], lastFive[3]]);
    });
	 
    //This is for when the client recieves its own hand from the server
    gs.socket.on("playerHand", function(data) {
      console.log("got my own hand");
      console.log(data.hand)
      playerStore.playerHand = data.hand;
      setDummy({});
    });
    
    //This is for when the client recieves another hand from the server
    gs.socket.on("otherHand", function(data) {
      console.log("got another hand");
    });

    // @NICK: A winner is decided and the index of the victorious player is passed in
    gs.socket.on("results", function(data) {
      setVictorIndex(data);
      setGameFinished(true);
    }) ;   
  }, []);
  
  const [textLog, setTextLog] = React.useState(["Welcome to Blacktop!\n"]);
  function eventsLog() {
    return (
      <div className="events-box">
        <html>
          {textLog}
        </html>
      </div>
    );
  }
  
  function gamePage() {
    return (
      // renders an unordered list of cards
      //button with the variable grabbed from the server
      <DndProvider backend={HTML5Backend}>
        <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0, height: '100vh'}} className="sendNotification">
          <div className="game-columns">
            <div>
              <img src={playerStore.currentPlayer.icon} className="flip-img" alt="Current Player" />
              <h1>{playerStore.currentPlayer.name}</h1>
              <div>
                <button onClick={cardDrawn}>Draw Card</button>
                <button onClick={turnEnded}>End Turn</button>
              </div>
            </div>
            <div style={{display: 'flex'}}>
              <Board />
              {eventsLog()}
            </div>
            <div className="list">
              {playerStore.getPlayers().map((element, i) => 
                <li style={{ listStyleType: "none" }} key={i}>
                  <img alt="icon" src={element.icon}/>
                  {element.name}
                  {playerStore.getPoints()}
                </li>
              )}
            </div>
          </div>
          <div className="hand">
            {/* <img src={NopeCard} alt="icon"/> */}
            {playerStore.getPlayerHand().map((card) => 
                <Card name={card} src={setImage(card)}/>
            )}
          </div>
        </div>
      </DndProvider>
    );
  }

  function resultsPage() {
    // playerStore.gameStarted = false;
    
    return(
      <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0, minHeight: '100vh'}}>
        <img src={ TestLogo } alt="logo" className="logo" />
        <img src={ ChalkLine } alt="line" className="line" />
        <div className="results">
          <h1>{playerStore.players[victorIndex].name === playerStore.currentPlayer.name ? "Victory!" : "Defeat!"}</h1>
          <img src={playerStore.players[victorIndex].icon} alt="Victor" />
          <h1>{playerStore.players[victorIndex].name}</h1>
          <Link to={{ pathname: '/', state:{ consent:'true'} }} >
            <button>Go Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return useObserver(() => (
    gameFinished ? resultsPage() : gamePage()
  ));
}
export default Game;

function sendId() {
	//sending the ID to the server so you can print it
	//socket.emit("ID", id);
}