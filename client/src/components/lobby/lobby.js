import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react-lite'
import { usePlayerStore } from '../player/player'
import './lobby.css';
import TestLogo from '../../images/TestLogo.png';
import TestCard from '../../images/TestCard.png';
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
import { TabPane } from 'semantic-ui-react';
import GameService from '../../services/GameService';

const gs = new GameService();

export const Lobby = () => {
    // gets store
	const {playerStore} = usePlayerStore();
    const index = playerStore.players.length - 1;

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

	function sendPlayer(newName, newIcon) {
		var pack = [ newName, playerStore.lobbyId, newIcon ];
		gs.socket.emit("playerName", pack);
	}

    const [dummy, setDummy] = React.useState({});
    useEffect(() => {
        gs.socket.on("updateNames", function(data) {
            playerStore.players = [];
            Object.keys(data).forEach(key => {
                console.log("added player");
                playerStore.addPlayer();
            });
            
            Object.entries(data).forEach(entry => {
                const [key, value] = entry;
                playerStore.setName(value[0], parseInt(key));

                let newIcon;
                switch (value[1]) {
                    case 1:
                        newIcon = Dragon;
                        break;
                    case 2:
                        newIcon = Frog;
                        break;
                    case 3:
                        newIcon = Goblin;
                        break;
                    case 4:
                        newIcon = Monkey;
                        break;
                    case 5:
                        newIcon = PlushCat;
                        break;
                    case 6:
                        newIcon = Seagull;
                        break;
                    case 7:
                        newIcon = Tangerine;
                        break;
                    case 8:
                        newIcon = Werewolf;
                        break;
                    case 9:
                        newIcon = Dragon;
                        break;
                    case 10:
                        newIcon = Dragon;
                        break;
                    case 11:
                        newIcon = Dragon;
                        break;
                    default:
                        newIcon = Brickshay;
                        break;
                }
                playerStore.setIcon(newIcon, parseInt(key));
            });

            setDummy({}); // Needed because Lobby doesn't re-render automatically after above change(s)
        })
    }, []);

    React.useEffect(() => {
        gs.socket.emit("anything");
      }, []);

    return useObserver(() => (
        <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0}}>
            <div className="manifest">
                <img alt="" src={TestLogo}/>
            </div>
            <img src={ChalkLine} />
            <div className="columns">
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
                    <div>
                        {playerStore.getPlayers().map((element, i) => 
                            <li style={{ listStyleType: "none" }} key={i}>
                                <br />
                                <img src={element.icon}/>
                                {element.name}
                                <br />
                            </li>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ));
};

export default Lobby;