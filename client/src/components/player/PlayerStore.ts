import { observable, action } from 'mobx'
// import { CardStore } from '../card/CardStore';
import Brickshay from '../../images/Brickshay.gif'

class Player {
    playerId: number;
    //lobbyId: number = 0;
    name: string;
    icon: any;
    index: number;
    lastPlayed: string;
    //hand: CardStore;
    //pointTotal: number;
   // isDead: boolean;
    
    constructor(index: number) {
        this.playerId = -1;
        this.name = "";
        this.icon = Brickshay;
        this.index = index;
        this.lastPlayed = "";
        //this.hand = new CardStore();
        //this.pointTotal = 0;
        //this.isDead = false;
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
        //console.log(this.players);
        this.players.push(new Player(this.players.length));
    }

    @action
    setID = (playerId: number, index: number) => {
        this.players[index].playerId = playerId;
    }

    @action
    setName = (newName: any, index: number) => {
        // console.log(newName + " goes to " + this.players[index].name);
        this.players[index].name = newName;
    }

    @action
    setIcon = (newIcon: any, index: number) => {
        // console.log(newIcon + " goes to " + this.players[index].icon);
        this.players[index].icon = newIcon;
    }

    @action
    setLastPlayed = (lastPlayed: string, index: number) => {
        this.players[index].lastPlayed = lastPlayed;
    }
}