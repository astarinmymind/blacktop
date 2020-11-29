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
import card from '../card/card'
// import { useCardStore } from '../card/card'
import './game.css'

import GameService from '../../services/GameService';

const gs = new GameService();

//Just a random ID i used to test that each client was different
var id = Math.floor(Math.random() * 100);

//address of the server

function Game() {
	//this is syntax I use to set variables, setTitle being the way to change them

  // gets store
  // const {cardStore} = useCardStore()
  const {playerStore} = usePlayerStore();

  // console.log(cardStore)

  // emits socket event that player has pressed start game
  function startGame() 
  {
      gs.socket.emit("gameStarted", playerStore.lobbyId);
  }

  // emits socket event that player has pressed start game
  function drawCard() 
  {
      gs.socket.emit("cardDrawn", playerStore.lobbyId);
      console.log("card drawn");
  }

  // emits socket event that player has pressed start game
  function playCard() 
  {
      gs.socket.emit("cardPlayed", playerStore.lobbyId);
      console.log("card played");
  }
  
  return useObserver(() => (
    // renders an unordered list of cards
    //button with the variable grabbed from the server
    <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0}}>
      <div className="game-columns">
        <div>
          <img src={playerStore.getPlayers()[0].icon} className="flip-img" alt="Current Player" />
          <h1>{playerStore.getPlayers()[0].name}</h1>
          <div>
            <button onClick={() => drawCard}>Draw Card</button>
          </div>
          <br />
          <div>
            <button /*onClick={() => cardStore.addCard('card string', 0)}*/>End Turn</button>
          </div>
        </div>
        <div>
          <h1>Drag card here to play it</h1>
        </div>
        <div className="list">
          {playerStore.getPlayers().map((element, i) => 
              <li style={{ listStyleType: "none" }} key={i}>
                  <br />
                  <img src={element.icon}/>
                  {element.name}
                  <br />
              </li>
          )}
          AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        </div>
      </div>
      <ul>
        {playerStore.getPlayerHand().map(card => (<li>{card}</li>))}
      </ul>
    </div>
  ));

}

function sendId() {
	//sending the ID to the server so you can print it
	//socket.emit("ID", id);
}

export default Game;