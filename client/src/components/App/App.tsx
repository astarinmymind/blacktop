import React from "react";
import ReactDOM from "react-dom";
import { CardProvider } from "../card/card";
import Main from "../main/main"
import { PlayerProvider } from "../player/player";

export const App = () => {
    return (
        <PlayerProvider><CardProvider>
            <div className="App">
                <Main />
            </div>
        </CardProvider></PlayerProvider>
    );
  }

export default App;