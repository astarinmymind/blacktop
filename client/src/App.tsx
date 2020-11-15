import React from "react";
import { useObserver } from 'mobx-react-lite'
import { CardStore } from "./components/card/CardStore";
import { useCardStore } from './components/card/card'

// import Home from './components/home/home';
// import Lobby from './components/lobby/lobby';
// import Game from './components/game/game';

function App() {

  const {cardStore} = useCardStore()
  
  return useObserver(() => (
    <>
      <ul>
        {cardStore.cards.map(card => (
            <li>{card}</li>
          ))}
      </ul>
      <button>Draw Card</button>
    </>
  ));
}

export default App;
