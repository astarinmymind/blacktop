import React from 'react';
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
import src from '*.avif';
import { TabPane } from 'semantic-ui-react';
import GameService from '../../services/GameService';

const gs = new GameService();

export const Lobby = () => {
    // gets store
	const {playerStore} = usePlayerStore();
    const index: number = playerStore.players.length - 1;

    const [name, setName] = React.useState("");
    const updateName = (event: React.ChangeEvent<HTMLInputElement>) => { 
		sendName(event.target.value);
        setName(event.target.value);
        //playerStore.setName(event.target.value, 0);
    }

    const [icon, setIcon] = React.useState();
    const updateIcon = (newIcon: any, index: number) => { 
        setIcon(newIcon);
        playerStore.setIcon(newIcon, 0);
    }

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
                    <h1>Random code here!</h1>
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
                            <img alt="" src={Brickshay} onClick={() => updateIcon(Brickshay, index)}/>
                            <img alt="" src={Dragon} onClick={() => updateIcon(Dragon, index)}/>
                            <img alt="" src={Frog} onClick={() => updateIcon(Frog, index)}/>
                            <img alt="" src={Goblin} onClick={() => updateIcon(Goblin, index)}/>
                        </>
                        <>
                            <img alt="" src={Monkey} onClick={() => updateIcon(Monkey, index)}/>
                            <img alt="" src={PlushCat} onClick={() => updateIcon(PlushCat, index)}/>
                            <img alt="" src={Seagull} onClick={() => updateIcon(Seagull, index)}/>
                            <img alt="" src={Tangerine} onClick={() => updateIcon(Tangerine, index)}/>
                        </>
                        <>
                            <img alt="" src={Werewolf} onClick={() => updateIcon(Werewolf, index)}/>
                            <img alt="" src={Brickshay} onClick={() => updateIcon(Brickshay, index)}/>
                            <img alt="" src={PlushCat} onClick={() => updateIcon(PlushCat, index)}/>
                            <img alt="" src={Brickshay} onClick={() => updateIcon(Brickshay, index)}/>
                        </>
                    </div>
                </div>
                <div>
                    <div>
                        {playerStore.players.map((element, i) => {
                            /*return(
                                <>
                                    <br />
                                    <img key={i} src={element.icon}/>
                                    {element.name}
                                    <br />
                                </>
                            );*/
                        })}
                    </div>
                </div>
            </div>
        </div>
    ));
	function sendName(value) {
		var pack = [ value, playerStore.lobbyId ];
		gs.socket.emit("playerName", pack);
	}
	
	function setNames(data) {
	for (var i in data)
	{
		playerStore.players[i].name = data[i];
	}
}
	
};

gs.socket.on("updateNames", function(data) {
	const SetPlayers = () => {
        const {playerStore} = usePlayerStore();
        playerStore.setPlayers(data);
    }
    SetPlayers();
});


export default Lobby;