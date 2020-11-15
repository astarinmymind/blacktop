import React from "react";

interface IProps {
    // id: number; // type of card
    // onCardClick: (card: any) => void; // handles card click
    disable: boolean; // can player use card?
}

class Card extends React.Component<IProps> {
    constructor(props: any) {
        super(props);
      }

    render() {
        return (
            <div>
                <p>renders card</p>
            </div>
        );
    }
}

export default Card;