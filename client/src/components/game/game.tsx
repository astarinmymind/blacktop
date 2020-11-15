import React from "react";
import Grid from '../grid/grid';
import Player from '../player/player';
import './game.css';

interface IProps {
}

interface IState {
}

class Game extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
      }

    render() {
        return (
            <>
                <Grid />
                <Player />
            </>
        );
    }
}

export default Game;