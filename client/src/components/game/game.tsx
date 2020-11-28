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
    <>
      <button onClick={drawCard}>Draw Card</button>
      <button onClick={playCard}>Play Card</button>
      <ul>
        {playerStore.playerHand.map(card => (<li>{card}</li>))}
      </ul>
    </>
  ));

}

function sendId() {
	//sending the ID to the server so you can print it
	//socket.emit("ID", id);
}

export default Game;