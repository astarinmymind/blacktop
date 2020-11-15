import React from "react";
import Grid from '../gamegrid/gamegrid';
import Player from '../player/player';

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