import React from "react";

import { useLocalStore, observer } from "mobx-react";
import { Dimmer, Grid, Loader } from "semantic-ui-react";

// import Card from '../card/card';
import "./gamegrid.css";

// interface IProps {
//     store?: IStore;
// }
class GameGrid extends React.Component {
    
    public render() {
        return (
            <> 
                <p>Game Grid</p>
            </>
        );
    }

    private handleCardClick = () => {
    };
    
    private renderCards() {
    }
}

export default GameGrid;