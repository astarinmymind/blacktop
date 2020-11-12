import React from 'react';
import './home.css';
import TestLogo from './images/TestLogo.png';
import TestCard from './images/TestCard.png';
import ChalkLine from './images/ChalkLine.png';
import PlushCat from './images/PlushCat.gif';
import Werewolf from './images/Werewolf.gif';

class Home extends React.Component {

    render() {
        return (
            <div style={{backgroundColor: "rgb(14, 14, 14)"}}>
                <div className="manifest">
                    <img src={TestLogo}/>
                </div>
                <div className="line">
                    <img src={ChalkLine}></img>
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <button>Host game</button>
                    <button>Join game</button>
                </div>
                <div className="columns">
                    <div>
                    </div>
                    <div>
                        <h1>Welcome to Blacktop!</h1>
                        Blacktop is a game about deception, strategy, and sabotage! 
                        <br />Each player brings with them a personalized side deck to assist them as they try to not get kazaap'd!
                        <br />You can join a public game or play a private game with your friends!
                        <br />
                    </div>
                    <div>
                        <img src={PlushCat}/>
                    </div>
                </div>
                <div className="columns">
                    <div>
                        <img src={Werewolf}/>
                    </div>
                    <div>
                        <h1>Rules</h1>
                        The goal of the game is to get your point total as close to 100 at the end of the final round without going over. 
                        The game is split up into rounds, with each round consisting of 3 turns. 
                        There are point cards, action cards, and bomb cards. 
                        During a turn, each player has the option to play cards, and then they must draw. 
                        At the end of each round, if a player’s point total is a multiple of ten, a special effect happens based on which ten they are on. 
                        The final round starts the first time a player’s point total is over a hundred at the end of the round.
                        <br />
                        <h2>Play Cards</h2>
                        <br />
                        <h2>Special Effects</h2>
                        <br />
                    </div>
                    <div>
                    </div>
                </div>
                <div className="columns">
                    <div>
                    </div>
                    <div>
                        <h1>Cards</h1>
                        <br />
                    </div>
                    <div>
                        <img src={TestCard}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;