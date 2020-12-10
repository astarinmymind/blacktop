/* Notes: 
Mobx:
    - store: (1) stores state properties (2) contains functions that modify state
    - creating observable state: 
        - @observable: defines trackable field that stores state
        - @action: marks method as modifying state 
*/

import { observable, action } from 'mobx'
import Brickshay from '../../images/Brickshay.gif'

class Player {
    playerId: number;
    name: string;
    icon: any;
    index: number;
    lastPlayed: string;

    constructor(index: number) {
        this.playerId = -1;
        this.name = "";
        this.icon = Brickshay;
        this.index = index;
        this.lastPlayed = "";
    }

    setPlayer(newName: string, newIcon: string) {
        this.name = newName;
        this.icon = newIcon;
    }
}

export class PlayerStore {
    // array of Player Objects
    players: Player[] = [];
    // array of Card Objects
    playerHand: {type: string, points: number}[] = [/*"nope", "give", "add1", "sub1", "nope", "draw", "see" */];

    point: number[] = [];

    @observable lobbyId: number = 0;

    @observable currentPlayerIndex: number = 0;

    @observable gameStarted: boolean = false;

    @observable turnNumber: number = 0;

    @observable opponentIndex: number = -1;

    @action
    getPlayerHand = () => {
        return this.playerHand;
    }

    @action 
    getPlayers = () => {
        return this.players;
    }

    @action 
    getPoints = () => {
        return this.point;
    }

    // pushes player onto player array 
    @action 
    addPlayer = () => {
        this.players.push(new Player(this.players.length));
    }

    @action
    setID = (playerId: number, index: number) => {
        this.players[index].playerId = playerId;
    }

    @action
    setName = (newName: any, index: number) => {
        this.players[index].name = newName;
    }

    @action
    setIcon = (newIcon: any, index: number) => {
        this.players[index].icon = newIcon;
    }

    @action
    setLastPlayed = (lastPlayed: string, index: number) => {
        this.players[index].lastPlayed = lastPlayed;
    }
}
