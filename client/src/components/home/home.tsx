import React, { useState, useEffect } from "react";
import { useObserver } from 'mobx-react-lite'
import { Link } from "react-router-dom";
import './home.css';
import TestLogo from '../../images/TestLogo.png';
import TestCard from '../../images/TestCard.png';
import ChalkLine from '../../images/ChalkLine.png';
import PlushCat from '../../images/PlushCat.gif';
import Werewolf from '../../images/Werewolf.gif';
import GameService from '../../services/GameService';
import { usePlayerStore } from '../player/player'


const gs = new GameService();


export const Home = () => { 
    const {playerStore} = usePlayerStore();
    
    const [lobbyId, setLobbyId] = React.useState("");
    const updateLobbyId = (event: React.ChangeEvent<HTMLInputElement>) => { 
        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex

        if (event.target.value === '' || re.test(event.target.value)) {
            setLobbyId(event.target.value);
        }
    }

    function sendLobbyId() {
		gs.socket.emit("joinLobby", lobbyId);
		playerStore.lobbyId = parseInt(lobbyId);
	}

    return useObserver(() => (
            <div style={{backgroundColor: "rgb(14, 14, 14)"}}>
                <div className="manifest">
                    <img src={ TestLogo }/>
                </div>
                <img src={ChalkLine} />
                <Link to="/lobby" style={{display: "flex", justifyContent: "center"}}>
                    <button onClick={ makeLobby }>Host game</button>
                </Link>
                <input 
                        name="lobbyId" 
                        type="text" 
                        maxLength={6} 
                        placeholder="Lobby code" 
                        value={ lobbyId }
                        onChange={ updateLobbyId }
                />
                <button onClick={ sendLobbyId }>Join game</button>
                <br />
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
    ));
	function makeLobby() 
	{
		var lobbyId = Math.floor(100000 + Math.random() * 900000);
		gs.socket.emit("makeLobby", lobbyId);
		playerStore.lobbyId = lobbyId;
	}
}


export default Home;