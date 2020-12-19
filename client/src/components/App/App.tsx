import React from "react";
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