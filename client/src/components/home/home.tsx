import React, { useEffect } from "react";
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
    
    // Create a lobby when Host Game is clicked
	function makeLobby() 
	{
		var lobbyId = Math.floor(100000 + Math.random() * 900000);
		gs.socket.emit("makeLobby", lobbyId);
        playerStore.lobbyId = lobbyId;
    }
    
    const [lobbyId, setLobbyId] = React.useState("");
    const updateLobbyId = (event: React.ChangeEvent<HTMLInputElement>) => { 
        const re = /^[0-9\b]+$/;

        // if value is not blank, then test the regex for digits only
        if (event.target.value === '' || re.test(event.target.value)) {
            setLobbyId(event.target.value);
            gs.socket.emit("validId", event.target.value);
            console.log(event.target.value);
        }
    }

    // If valid, send entered Lobby ID to socket to be checked if it is valid
    function sendLobbyId() {
        if (!lobbyId || !isVaildId) {
            alert("You must enter a valid, 6-digit game code!");
        }
        else {
            gs.socket.emit("joinLobby", lobbyId);
            playerStore.lobbyId = parseInt(lobbyId);
        }
    }

    const [isVaildId, setIsValidId] = React.useState(false);
    useEffect(() => {
        // Set local state to the validity of the entered Lobby ID
        gs.socket.on("valID", function(data) {
            setIsValidId(data);
        })
    }, []);
    
    // A link that is only active if the lobby ID is valid
    const ConditionalLink = () => isVaildId
      ? <Link to="/lobby"><button onClick={ sendLobbyId }>Join game</button></Link>
      : <><button onClick={ sendLobbyId }>Join game</button></>;
    console.log(isVaildId);

    return useObserver(() => (
        <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0}}>
            <div className="manifest">
                <img src={ TestLogo } alt="logo" />
            </div>
            <img src={ChalkLine} alt="line" />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to="/lobby">
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
                <ConditionalLink />
            </div>
                <br />
                <br />
            <div className="home-columns">
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
                    <img src={PlushCat} alt="" />
                </div>
            </div>
            <div className="home-columns">
                <div>
                    <img src={Werewolf} alt="" />
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
            <div className="home-columns">
                <div>
                </div>
                <div>
                    <h1>Cards</h1>
                    <br />
                </div>
                <div>
                    <img src={TestCard} alt="" />
                </div>
            </div>
        </div>
    ));
}

export default Home;