import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../home/home';
import Lobby from '../lobby/lobby';

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/lobby' component={Lobby}></Route>
    </Switch>
  );
}

export default Main;