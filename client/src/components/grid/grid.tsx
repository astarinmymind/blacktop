import React from "react";
import Card from '../card/card';

interface IProps {
}

interface IState {
}

class Grid extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
      }

    render() {
        return (
            <>
                <Card disable={true}/>
            </>
        );
    }
}

export default Grid;