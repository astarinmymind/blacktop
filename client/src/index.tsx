/*
Note: We wrap App in Provider to pass all store instances to all child components wrapped within.
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css'
import App from "./components/App/App"
import { CardProvider } from './components/card/card';
import { PlayerProvider } from "./components/player/player";
import { SocketService } from './SocketService';
import { ChatContext } from './ChatContext';

const chat = new SocketService();

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);