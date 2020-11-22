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
import { useObserver } from 'mobx-react-lite'
import { useCardStore } from '../card/card'
import socketIOClient from "socket.io-client";

//Just a random ID i used to test that each client was different
var id = Math.floor(Math.random() * 100);

//address of the server
const ENDPOINT = "http://127.0.0.1:5000";
const socket = socketIOClient(ENDPOINT);

function Game() {
	//this is syntax I use to set variables, setTitle being the way to change them
	const [title, setTitle] = useState("");
	
	useEffect(() => {
		//grabbing the data from the server
		socket.on("Title", data => {
			setTitle(data);
		});
	}, []);

  // gets store
  const {cardStore} = useCardStore()

  console.log(cardStore)
  
  return useObserver(() => (
    // renders an unordered list of cards
    //button with the variable grabbed from the server
    <>
      <button onClick={() => cardStore.addCard('card string', 0)}>Draw Card</button>
      <ul>
        {cardStore.cards.map(card => (<li>{card}</li>))}
      </ul>
	  <button onClick={ sendId }>{title}</button>
    </>
  ));

}

function sendId() {
	//sending the ID to the server so you can print it
	socket.emit("ID", id);
}

export default Game;