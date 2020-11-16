/*
Notes: 
  -useObserver: used to observe values from store
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
  
  return useObserver(() => (
    <>
      // renders an unordered list of cards
      <ul>
        {cardStore.cards.map(card => (<li>{card}</li>))}
      </ul>
      <button onClick={() => cardStore.addCard('card string', 0)}>Draw Card</button>
    </>
  ));
}

export default App;
