/*
Notes: 
  -useObserver: used to observe values from store
  -React Fragment (notation: <> </> )  
    - allows component to return multiple elements
    - let you group a list of children without adding extra nodes to the DOM
*/

import React from "react";
import { useObserver } from 'mobx-react-lite'
import { useCardStore } from './components/card/card'

// import Home from './components/home/home';
// import Lobby from './components/lobby/lobby';
// import Game from './components/game/game';

function App() {

  // gets store
  const {cardStore} = useCardStore()

  console.log(cardStore)
  
  return useObserver(() => (
    // renders an unordered list of cards
    <>
      <ul>
        {cardStore.cards.map(card => (<li>{card}</li>))}
      </ul>
      <button onClick={() => cardStore.addCard('card string', 0)}>Draw Card</button>
    </>
  ));

}

export default App;
