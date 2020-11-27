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
		sendPlayer(event.target.value, icon);
        setName(event.target.value);
    }

    const [icon, setIcon] = React.useState(Brickshay);
    const updateIcon = (newIcon) => { 
		sendPlayer(name, newIcon);
        setIcon(newIcon);
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
                playerStore.setIcon(value[1], parseInt(key));
            });

            setDummy({}); // Needed because Lobby doesn't re-render automatically after above change(s)
        })
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
                            <img alt="" src={Brickshay} onClick={() => updateIcon(Brickshay)}/>
                            <img alt="" src={Dragon} onClick={() => updateIcon(Dragon)}/>
                            <img alt="" src={Frog} onClick={() => updateIcon(Frog)}/>
                            <img alt="" src={Goblin} onClick={() => updateIcon(Goblin)}/>
                        </>
                        <>
                            <img alt="" src={Monkey} onClick={() => updateIcon(Monkey)}/>
                            <img alt="" src={PlushCat} onClick={() => updateIcon(PlushCat)}/>
                            <img alt="" src={Seagull} onClick={() => updateIcon(Seagull)}/>
                            <img alt="" src={Tangerine} onClick={() => updateIcon(Tangerine)}/>
                        </>
                        <>
                            <img alt="" src={Werewolf} onClick={() => updateIcon(Werewolf)}/>
                            <img alt="" src={Brickshay} onClick={() => updateIcon(Brickshay)}/>
                            <img alt="" src={PlushCat} onClick={() => updateIcon(PlushCat)}/>
                            <img alt="" src={Brickshay} onClick={() => updateIcon(Brickshay)}/>
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