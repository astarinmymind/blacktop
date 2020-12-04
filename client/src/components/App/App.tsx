import React from "react";
// import ReactDOM from "react-dom";
// import { CardProvider } from "../card/card";
import Main from "../main/main"
import { PlayerProvider } from "../player/player";

export const App = () => {
    return (
        <PlayerProvider>
            <div className="App">
                <Main />
            </div>
        </PlayerProvider>
    );
  }

export default App;