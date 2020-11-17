import React from 'react';
import { useObserver } from 'mobx-react-lite'
import { usePlayerStore } from '../player/player'
import './lobby.css';
import TestLogo from '../../images/TestLogo.png';
import TestCard from '../../images/TestCard.png';
import ChalkLine from '../../images/ChalkLine.png';
import PlushCat from '../../images/PlushCat.gif';
import Werewolf from '../../images/Werewolf.gif';
import src from '*.avif';

export const Lobby = () => {
    // gets store
    const {playerStore} = usePlayerStore();
  
    console.log(playerStore);

    playerStore.addPlayer();

    return useObserver(() => (
        <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0}}>
            <div className="manifest">
                <img src={TestLogo}/>
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
                        value="" 
                        onChange={playerStore.setName}
                    />
                    <div className="icon-gallery">
                        <>
                            <img src={Werewolf} onClick={() => playerStore.setIcon(Werewolf)}/>
                            <img src={PlushCat} onClick={() => playerStore.setIcon(PlushCat)}/>
                            <img src={Werewolf} onClick={() => playerStore.setIcon(Werewolf)}/>
                            <img src={PlushCat} onClick={() => playerStore.setIcon(PlushCat)}/>
                        </>
                        <>
                            <img src={PlushCat} onClick={() => playerStore.setIcon(PlushCat)}/>
                            <img src={PlushCat} onClick={() => playerStore.setIcon(PlushCat)}/>
                            <img src={Werewolf} onClick={() => playerStore.setIcon(Werewolf)}/>
                            <img src={Werewolf} onClick={() => playerStore.setIcon(Werewolf)}/>
                        </>
                        <>
                            <img src={Werewolf} onClick={() => playerStore.setIcon(Werewolf)}/>
                            <img src={PlushCat} onClick={() => playerStore.setIcon(PlushCat)}/>
                            <img src={PlushCat} onClick={() => playerStore.setIcon(PlushCat)}/>
                            <img src={Werewolf} onClick={() => playerStore.setIcon(Werewolf)}/>
                        </>
                    </div>
                </div>
                <div>
                    <div>
                        <img src={playerStore.players[0].icon}/>
                        {playerStore.players[0].name}
                    </div>
                </div>
            </div>
        </div>
    ));
};

export default Lobby;