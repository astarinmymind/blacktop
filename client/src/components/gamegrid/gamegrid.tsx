import React from "react";

import { inject, observer } from "mobx-react";
import { Dimmer, Grid, Loader } from "semantic-ui-react";

import { IStore } from "../../stores/IStore";
import Card from '../card/card';
import "./gamegrid.css";

interface IProps {
    store?: IStore;
}

@inject("store")
@observer
class GameGrid extends React.Component<IProps> {
    
    // set state 
    private get store(): IStore {
        return this.props.store as IStore;
      }

    public render() {

        // react hook: 
        const {cards} = this.store.game;

        return (
            <>
                {this.renderCards(cards, true)}
            </>
        );
    }

    private handleCardClick = (card: string) => {
        // this.store.dropCard(card);
    };
    
    private renderCards(cards?: string[], isClickable: boolean = false) {
        if (!cards) {
            return null;
        }

        return cards.map(card => (
            <Card
            // disable={!isClickable}
            // onCardClick={this.handleCardClick}
            />
        ));
    }
}

export default GameGrid;