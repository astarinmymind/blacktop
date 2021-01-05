import React, { useEffect } from "react";
import { useObserver } from 'mobx-react-lite'
import { Link } from "react-router-dom";
import './home.css';
import TestLogo from '../../images/TestLogo.png';
import ChalkLine from '../../images/ChalkLine.png';
import PlushCat from '../../images/PlushCat.gif';
import Werewolf from '../../images/Werewolf.gif';
import GameService from '../../services/GameService.js';
import { usePlayerStore } from '../player/player'
import NopeCard from '../../images/TestCard.png';
import DrawCard from '../../images/DrawCard.png';
import GiveCard from '../../images/GiveCard.png';
import SeeCard from '../../images/PeekCard.png';
import StealCard from '../../images/StealCard.png'

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
            alert("You must enter a valid, 6-digit game code and the lobby must have less than 4 players for you to join!");
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

        gs.socket.on("playerIndex", function(data) {
            playerStore.currentPlayerIndex = data;
        })
    }, []);
    
    // A link that is only active if the input lobby ID is valid
    const ConditionalLink = () => isVaildId
      ? <Link to="/lobby"><button onClick={ sendLobbyId }>Join game</button></Link>
      : <><button onClick={ sendLobbyId }>Join game</button></>;
    console.log(isVaildId);

    return useObserver(() => (
        <div style={{backgroundColor: "rgb(14, 14, 14)", minHeight: '100vh', margin: 0}}>
            <img src={ TestLogo } alt="logo" className="logo" />
            <img src={ ChalkLine } alt="line" className="line" />
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
            <div className="home-columns"> {/* In the home-columns style class, empty divs mean empty columns */}
                <div />  {/* Column 1 */}
                <div>  {/* Column 2 */}
                    <h1>Welcome to Blacktop!</h1>
                    Blacktop is a game of deception, strategy, and sabotage! 
                    <br />Grab some friends and hop in a game!
                    <br />
                </div>
                <div>  {/* Column 3 */}
                    <img src={PlushCat} alt="" />
                </div>
            </div>
            <div className="home-columns">
                <div>  {/* Column 1 */}
                    <img src={Werewolf} alt="" />
                </div>
                <div>  {/* Column 2 */}
                    <h1>How It Works</h1>
                    Every player takes turns drawing and playing cards.
                    <br /> The goal is to be the first one to get to 100 points.
                    <br /> But if you go over, you lose!
                    <br /> All other cards help you or harm others! 
                    <br /> Play as many cards as you want, then draw and end turn. 
                    <br /> Play various cards to add and subtract your points, 
                    <br /> give and steal cards,
                    <br /> peek the deck or skip the next player's turn!
                    <br /> NOPE cards can be played at ANY TIME! And cancels the effect of any card. 
                    <br />
                    <br />
                    <br />
                    <h1>Cards</h1>
                    <br />
                </div>
                <div />  {/* Column 3 */}
            </div>
            <div className="cards">
                <div className="row">
                    <div className="column">
                        <img src={NopeCard} alt=""/>
                    </div>
                    <div className="column">
                        <img src={DrawCard} alt=""/>
                    </div>
                    <div className="column">
                        <img src={GiveCard} alt=""/>
                    </div>
                    <div className="column">
                        <img src={StealCard} alt=""/>
                    </div>
                    <div className="column">
                        <img src={SeeCard} alt=""/>
                    </div>
                </div>
            </div>
            <div className="home-columns">
                <div />  {/* Column 1 */}
                <div>
                    <h1>Credits</h1>  {/* Column 2 */}
                    Angela Lu - Frontend / React, State Management
                    <br />Aryaman Ladha - Backend / Database
                    <br />Cole Strain - Frontend / React, UI, Art
                    <br />Lenny Wu - Backend / Game Logic
                    <br />Nicholas Browning - Networking / Socket, Art
                    <br />
                </div>
                <div />  {/* Column 3 */}
            </div>
        </div>
    ));
}

export default Home;