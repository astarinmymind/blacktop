import React from "react";

interface IProps {
}

interface IState {
}

class Player extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
      }

    render() {
        return (
            <>
                <p>list of players</p>
            </>
        );
    }
}

export default Player;