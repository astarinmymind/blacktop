/*
Notes: 
  -useObserver: used to observe values from store
  -React Fragment (notation: <> </> )  
    - allows component to return multiple elements
    - let you group a list of children without adding extra nodes to the DOM
*/

import { CardStore } from "../card/CardStore";
  
//export const Game = () => {
import React, { useState, useEffect } from "react";
import { usePlayerStore } from '../player/player'
import { useObserver } from 'mobx-react-lite'
import { useCardStore } from '../card/card'

//Just a random ID i used to test that each client was different
var id = Math.floor(Math.random() * 100);

//address of the server

function Game() {
	//this is syntax I use to set variables, setTitle being the way to change them

  // gets store
  const {cardStore} = useCardStore()
  const {playerStore} = usePlayerStore();

  console.log(cardStore)
  
  return useObserver(() => (
    // renders an unordered list of cards
    //button with the variable grabbed from the server
    <>
      <button onClick={() => cardStore.addCard('card string', 0)}>Draw Card</button>
      <ul>
        {cardStore.cards.map(card => (<li>{card}</li>))}
      </ul>
    </>
  ));

}

function sendId() {
	//sending the ID to the server so you can print it
	//socket.emit("ID", id);
}

export default Game;