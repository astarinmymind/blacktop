/*
Notes: 
  -useObserver: used to observe values from store
  -React Fragment (notation: <> </> )  
    - allows component to return multiple elements
    - let you group a list of children without adding extra nodes to the DOM
*/

// import { CardStore } from "../card/CardStore";
  
//export const Game = () => {
import React, { useState, useEffect } from "react";
import { usePlayerStore } from '../player/player'
import { useObserver } from 'mobx-react-lite'
import { ToastContainer, toast } from 'react-toastify';
import card from '../card/card'
// import { useCardStore } from '../card/card'
import './game.css'
import NopeCard from '../../images/NOPE.png'
import AddCard from '../../images/ADD1.png'
import SubCard from '../../images/SUB1.png'
import DrawCard from '../../images/DRAW.png'
import GiveCard from '../../images/GIVE.png'
import SeeCard from '../../images/SEE.png'

import GameService from '../../services/GameService';

const gs = new GameService();

//Just a random ID i used to test that each client was different
var id = Math.floor(Math.random() * 100);

//address of the server
toast.configure();
function Game() {
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
      gs.socket.emit("cardDrawn", playerStore.lobbyId, playerStore.currentPlayer.playerId);
      console.log("card drawn");
  }

  // emits socket event that player has played a card 
  // @COLE: integrate which card was dragged by changing index of playerhand (3rd parameter)
  function playCard() 
  {
      gs.socket.emit("cardPlayed", playerStore.lobbyId, playerStore.currentPlayer.playerId, playerStore.playerHand[1]);
      console.log("card played");
  }

  function setImage(cardname: string) 
  {
      switch (cardname) {
          case "nope":
              return NopeCard;
              break;
          case "add1":
              return AddCard;
              break;
          case "sub1":
              return SubCard;
              break;
          case "give":
              return GiveCard;
              break;
          case "see":
              return SeeCard;
              break;
          case "draw":
              return DrawCard;
              break;
          default: 
              break;
      }
      return;
  }

  // function sendNotification(event: string) 
  function sendNotification() 
  {
    console.log('toast message')
    // switch (event) {
    //   case "nopeEvent":
    toast.dark('NOPE!', {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      });
      //     break;
      // case "giveEvent":
      //     toast.dark('🦄 CARD GIVETH!', {
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       });
      //     break;
      // case "seefutureEvent":
      //     toast.dark('🦄 SEE THE FUTURE!', {
      //       position: "top-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       });
      //     break;
      // default: 
      //     break;
  }
   
   const [gameEvent, setGameEvent] = React.useState({});
   React.useEffect(() => {

    // @NICK: update player hand after draw/play Card Event
    gs.socket.on("updatePlayerHand", function(data) {
        playerStore.playerHand = data;
    });

    // @NICK: event notification: nope, give, see, draw event
    gs.socket.on("eventNotification", function(data) {
        // sendNotification(data);
    });
	 
    //This is for when the client recieves its own hand from the server
    gs.socket.on("playerHand", function(data) {
      console.log("got my own hand");
    });
    
    //This is for when the client recieves another hand from the server
    gs.socket.on("otherHand", function(data) {
      console.log("got another hand");
    });
    
   }, []);
  
  return useObserver(() => (
    // renders an unordered list of cards
    //button with the variable grabbed from the server
    <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0, height: '100vh'}} className="sendNotification">
      <div className="game-columns">
        <div>
        <img src={playerStore.currentPlayer.icon} className="flip-img" alt="Current Player" />
          <h1>{playerStore.currentPlayer.name}</h1>
          <div>
          <ToastContainer
position="bottom-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss={false}
draggable={false}
pauseOnHover={false}/>
            <button onClick={sendNotification}>Draw Card</button>
          </div>
          <br />
          <div>
            <button /*onClick={() => cardStore.addCard('card string', 0)}*/>End Turn</button>
          </div>
        </div>
        <div>
          <div className="rectangle">
            <h1>Drag card here to play it</h1>
          </div>
        </div>
        <div className="list">
          <br />
          {playerStore.getPlayers().map((element, i) => 
              <li style={{ listStyleType: "none" }} key={i}>
                  <img src={element.icon}/>
                  {element.name}
              </li>
          )}
        </div>
      </div>
      <ul style={{ listStyleType: "none" }} className="hand" >
        {playerStore.getPlayerHand().map(card => (
          <img src={setImage(card)}/>
        ))}
      </ul>
    </div>
  ));
}

function sendId() {
	//sending the ID to the server so you can print it
	//socket.emit("ID", id);
}

export default Game;