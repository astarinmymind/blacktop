import React from 'react';
import { useObserver } from 'mobx-react-lite'
import { usePlayerStore } from '../player/player'
import { Link } from "react-router-dom";
import './lobby.css';
import TestLogo     from '../../images/TestLogo.png';
import ChalkLine    from '../../images/ChalkLine.png';
import Brick        from '../../images/Brick.gif';
import Bruin        from '../../images/Bruin.gif';
import Dragon       from '../../images/Dragon.gif';
import Frog         from '../../images/Frog.gif';
import Goblin       from '../../images/Goblin.gif';
import Monkey       from '../../images/Monkey.gif';
import Mouse        from '../../images/Mouse.gif';
import PlushCat     from '../../images/PlushCat.gif';
import Seagull      from '../../images/Seagull.gif';
import Slug         from '../../images/Slug.gif';
import Tangerine    from '../../images/Tangerine.gif';
import Werewolf     from '../../images/Werewolf.gif';
import Detective    from '../../images/Detective.gif';
import GameService from '../../services/GameService.js';

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
                return Mouse;
            case 6:
                return PlushCat;
            case 7:
                return Seagull;
            case 8:
                return Slug;
            case 9:
                return Tangerine;
            case 10:
                return Werewolf;
            case 11:
                return Bruin;
            case 12:
                return Detective;
            default:
                return Brick;
        }
    }

    const [name, setName] = React.useState("");
    const [iconId, setIconId] = React.useState(Brick);
    const updateName = (event) => { 
        if (!playerStore.gameStarted) {
            sendPlayer(event.target.value, iconId);
            setName(event.target.value);
        }
        else {
            alert("The game has already started! Click \"Enter game\" to join.");
        }
    }
    const updateIcon = (newIconId) => {
        if (!playerStore.gameStarted) { 
            sendPlayer(name, newIconId);
            setIconId(newIconId);
        }
        else {
            alert("The game has already started! Click \"Enter game\" to join.");
        }
    }

    // Sends the player's name and icon to socket and playerStore
	function sendPlayer(newName, newIconId) {
		var pack = [ newName, playerStore.lobbyId, newIconId ];
        gs.socket.emit("playerName", pack);

        if (!playerStore.players[playerStore.currentPlayerIndex])
        {
            playerStore.addPlayer();
        }
        playerStore.players[playerStore.currentPlayerIndex].setPlayer(newName, idToIcon(newIconId));
    }

    const [dummy, setDummy] = React.useState({});
    
    React.useEffect(() => {
        gs.socket.emit("enterLobby", playerStore.lobbyId);

        gs.socket.on("updateNames", function(data) {
            playerStore.players = [];
            Object.keys(data).forEach(key => {
                console.log("added player");
                playerStore.addPlayer(key);
            });
            
            Object.entries(data).forEach(entry => {
                console.log("data: ", data);
                const [key, value] = entry;
                playerStore.setID(value[0], parseInt(key))
                playerStore.setName(value[1], parseInt(key));
                playerStore.setIcon(idToIcon(value[2]), parseInt(key));
            });

            setDummy({}); // Needed because Lobby doesn't re-render automatically after above change(s)
        })

        gs.socket.on("startGame", function(data) {
            playerStore.gameStarted = true;
        })
    }, []);

    // emits socket event that player has pressed start game
    function startGame() 
    {
        if (!name) {
            sendPlayer(" ", iconId);
            setName(" ");
        }

        if (playerStore.players.length <= 1) {
            alert("There must be at least 2 players for the game to properly work!");
        }

        if (!playerStore.gameStarted) {
            gs.socket.emit("gameStarted", playerStore.lobbyId);
            console.log(playerStore.lobbyId);
        }
    }

    return useObserver(() => (
        <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0, minHeight: '100vh'}}>
            <img src={ TestLogo } alt="logo" className="logo" onClick={() => updateIcon(12)} style={{cursor:'zoom-in'}} />
            <img src={ ChalkLine } alt="line" className="line" />
            <div className="lobby-columns">
                <div style={{textAlign: "right"}}>  {/* Column 1 */}
                    <h1>Game Code: </h1>
                    <h1>Name: </h1>
                    <h1>Icon: </h1>
                </div>
                <div>  {/* Column 2 */}
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
                            <img alt="" src={Brick} onClick={() => updateIcon(0)}/>
                            <img alt="" src={Dragon}    onClick={() => updateIcon(1)}/>
                            <img alt="" src={Frog}      onClick={() => updateIcon(2)}/>
                            <img alt="" src={Goblin}    onClick={() => updateIcon(3)}/>
                        </>
                        <>
                            <img alt="" src={Monkey}    onClick={() => updateIcon(4)}/>
                            <img alt="" src={Mouse}     onClick={() => updateIcon(5)}/>
                            <img alt="" src={PlushCat}  onClick={() => updateIcon(6)}/>
                            <img alt="" src={Seagull}   onClick={() => updateIcon(7)}/>
                        </>
                        <>
                            <img alt="" src={Slug} onClick={() => updateIcon(8)}/>
                            <img alt="" src={Tangerine}  onClick={() => updateIcon(9)}/>
                            <img alt="" src={Werewolf}  onClick={() => updateIcon(10)}/>
                            <img alt="" src={Bruin} onClick={() => updateIcon(11)}/>
                        </>
                    </div>
                </div>
                <div>  {/* Column 3 */}
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