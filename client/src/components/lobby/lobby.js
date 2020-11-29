import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react-lite'
import { usePlayerStore } from '../player/player'
import { Link, withRouter } from "react-router-dom";
import './lobby.css';
import TestLogo from '../../images/TestLogo.png';
import ChalkLine from '../../images/ChalkLine.png';
import Brickshay from '../../images/Brickshay.gif';
import Dragon from '../../images/Dragon.gif';
import Frog from '../../images/Frog.gif';
import Goblin from '../../images/Goblin.gif';
import Monkey from '../../images/Monkey.gif';
import PlushCat from '../../images/PlushCat.gif';
import Seagull from '../../images/Seagull.gif';
import Tangerine from '../../images/Tangerine.gif';
import Werewolf from '../../images/Werewolf.gif';
// import src from '*.avif';
import GameService from '../../services/GameService';

const gs = new GameService();

export const Lobby = () => {
    // gets store
    const {playerStore} = usePlayerStore();
    
    function idToIcon (iconId) {
        switch (iconId) {
            case 1:
                return Dragon;
            case 2:
                return Frog;
            case 3:
                return Goblin;
            case 4:
                return Monkey;
            case 5:
                return PlushCat;
            case 6:
                return Seagull;
            case 7:
                return Tangerine;
            case 8:
                return Werewolf;
            case 9:
                return Goblin;
            case 10:
                return Goblin;
            case 11:
                return Goblin;
            default:
                return Brickshay;
        }
    }

    const [name, setName] = React.useState("");
    const updateName = (event) => { 
		sendPlayer(event.target.value, iconId);
        setName(event.target.value);
    }

    const [iconId, setIconId] = React.useState(Brickshay);
    const updateIcon = (newIconId) => { 
		sendPlayer(name, newIconId);
        setIconId(newIconId);
    }

	function sendPlayer(newName, newIconId) {
		var pack = [ newName, playerStore.lobbyId, newIconId ];
        gs.socket.emit("playerName", pack);

        playerStore.currentPlayer.setPlayer(newName, idToIcon(newIconId));
    }

    const [dummy, setDummy] = React.useState({});
    React.useEffect(() => {
        gs.socket.emit("enterLobby", playerStore.lobbyId);

        gs.socket.on("updateNames", function(data) {
            playerStore.players = [];
            Object.keys(data).forEach(key => {
                console.log("added player");
                playerStore.addPlayer();
            });
            
            Object.entries(data).forEach(entry => {
                const [key, value] = entry;
                playerStore.setName(value[0], parseInt(key));

                playerStore.setIcon(idToIcon(value[1]), parseInt(key));
            });

            setDummy({}); // Needed because Lobby doesn't re-render automatically after above change(s)
        })
    }, []);

    // emits socket event that player has pressed start game
    function startGame() 
    {
        console.log(playerStore.gameStarted);
        if (!playerStore.gameStarted) {
            gs.socket.emit("gameStarted", playerStore.lobbyId);
            console.log(playerStore.lobbyId);
        }
    }

    const [starting, setStarting] = React.useState({});
    useEffect(() => {
        gs.socket.on("startGame", function(data) {
            playerStore.gameStarted = true;
        })
    }, []);

    return useObserver(() => (
        <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0, height: '100vh'}}>
            <div className="manifest">
                <img alt="" src={TestLogo}/>
            </div>
            <img src={ChalkLine} />
            <div className="lobby-columns">
                <div style={{textAlign: "right"}}>
                    <h1>Game Code: </h1>
                    <h1>Name: </h1>
                    <h1>Icon: </h1>
                </div>
                <div>
                    <h1>{playerStore.lobbyId}</h1>
                    <input 
                        name="name" 
                        type="text" 
                        maxLength={12} 
                        placeholder="Type name here" 
                        value={name}
                        onChange={updateName}
                    />
                    <div className="icon-gallery">
                        <>
                            <img alt="" src={Brickshay} onClick={() => updateIcon(0)}/>
                            <img alt="" src={Dragon} onClick={() => updateIcon(1)}/>
                            <img alt="" src={Frog} onClick={() => updateIcon(2)}/>
                            <img alt="" src={Goblin} onClick={() => updateIcon(3)}/>
                        </>
                        <>
                            <img alt="" src={Monkey} onClick={() => updateIcon(4)}/>
                            <img alt="" src={PlushCat} onClick={() => updateIcon(5)}/>
                            <img alt="" src={Seagull} onClick={() => updateIcon(6)}/>
                            <img alt="" src={Tangerine} onClick={() => updateIcon(7)}/>
                        </>
                        <>
                            <img alt="" src={Werewolf} onClick={() => updateIcon(8)}/>
                            <img alt="" src={Brickshay} onClick={() => updateIcon(9)}/>
                            <img alt="" src={PlushCat} onClick={() => updateIcon(10)}/>
                            <img alt="" src={Brickshay} onClick={() => updateIcon(11)}/>
                        </>
                    </div>
                </div>
                <div>
                    <div className="list">
                        {playerStore.getPlayers().map((element, i) => 
                            <li style={{ listStyleType: "none" }} key={i}>
                                <br />
                                <img src={element.icon} alt={`Player ${i+1}`} />
                                {element.name}
                                <br />
                            </li>
                        )}
                    </div>
                    <br />
                    <br />
                    <Link to={{ pathname: '/game', state:{ consent:'true'} }} >
                        <button onClick={startGame}>Enter game</button>
                    </Link>
                </div>
            </div>
        </div>
    ));
};

export default Lobby;