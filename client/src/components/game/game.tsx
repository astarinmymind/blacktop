/*
Notes: 
  -useObserver: used to observe values from store
  -React Fragment (notation: <> </> )  
    - allows component to return multiple elements
    - let you group a list of children without adding extra nodes to the DOM
*/

import React from "react";
import { useState } from "react";
import { useObserver } from 'mobx-react-lite'
import { useCardStore } from '../card/card'
import { CardStore } from "../card/CardStore";
  
export const Game = () => {
  // gets store
  const {cardStore} = useCardStore()

  console.log(cardStore)
  
  return useObserver(() => (
    // renders an unordered list of cards
    <>
      <button onClick={() => cardStore.addCard('card string', 0)}>Draw Card</button>
      <ul>
        {cardStore.cards.map(card => (<li>{card}</li>))}
      </ul>
    </>
  ));

}

export default Game;