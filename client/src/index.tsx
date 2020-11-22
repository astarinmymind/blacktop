/*
Note: We wrap App in Provider to pass all store instances to all child components wrapped within.
*/

import React from "react";
import ReactDOM from "react-dom";
import 'semantic-ui-css/semantic.min.css'
import Game from "./components/game/game";
import Lobby from "./components/lobby/lobby";
import { CardProvider } from './components/card/card';
import { PlayerProvider } from "./components/player/player";
import { SocketService } from './SocketService';
import { ChatContext } from './ChatContext';

const chat = new SocketService();

ReactDOM.render(
    <PlayerProvider><CardProvider>
        <Lobby />
    </CardProvider></PlayerProvider>,
    document.getElementById("root")
);