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

export const Lobby = () => {
    // gets store
    const {playerStore} = usePlayerStore();
  
    console.log(playerStore);
    
    playerStore.addPlayer();
    const index: number = playerStore.players.length - 1;

    const [name, setName] = React.useState("");
    const updateInput = (event: React.ChangeEvent<HTMLInputElement>) => { 
        setName(event.target.value);
        playerStore.setName(event.target.value, 0);
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
                        onChange={updateInput}
                    />
                    <div className="icon-gallery">
                        <>
                            <img alt="" src={Brickshay} onClick={() => playerStore.setIcon(Brickshay, index)}/>
                            <img alt="" src={Dragon} onClick={() => playerStore.setIcon(Dragon, index)}/>
                            <img alt="" src={Frog} onClick={() => playerStore.setIcon(Frog, index)}/>
                            <img alt="" src={Goblin} onClick={() => playerStore.setIcon(Goblin, index)}/>
                        </>
                        <>
                            <img alt="" src={Monkey} onClick={() => playerStore.setIcon(Monkey, index)}/>
                            <img alt="" src={PlushCat} onClick={() => playerStore.setIcon(PlushCat, index)}/>
                            <img alt="" src={Seagull} onClick={() => playerStore.setIcon(Seagull, index)}/>
                            <img alt="" src={Tangerine} onClick={() => playerStore.setIcon(Tangerine, index)}/>
                        </>
                        <>
                            <img alt="" src={Werewolf} onClick={() => playerStore.setIcon(Werewolf, index)}/>
                            <img alt="" src={Brickshay} onClick={() => playerStore.setIcon(Brickshay, index)}/>
                            <img alt="" src={PlushCat} onClick={() => playerStore.setIcon(PlushCat, index)}/>
                            <img alt="" src={Brickshay} onClick={() => playerStore.setIcon(Brickshay, index)}/>
                        </>
                    </div>
                </div>
                <div>
                    <div>
                        {playerStore.players.map((element, i) => {
                            return(
                                <>
                                    <br />
                                    <img key={i} src={element.icon}/>
                                    {element.name}
                                    <br />
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    ));
};

export default Lobby;