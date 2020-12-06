import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../home/home';
import Lobby from '../lobby/lobby';
import Game from '../game/game';

import { usePlayerStore } from '../player/player';

import GameService from '../../services/GameService';

const gs = new GameService();

const Main = () => {

  const {playerStore} = usePlayerStore();

  const [dummy, setDummy] = React.useState({});
  React.useEffect(() => {
	 
    //This is for when the client recieves its own hand from the server
    gs.socket.on("playerHand", function(data) {
      console.log("player hand rendered")
      playerStore.playerHand = data.hand;
      setDummy({});
    });
    
  }, []);


  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/lobby' component={Lobby}></Route>
      <Route exact path='/game' component={Game}></Route>
    </Switch>
  );
}

export default Main;