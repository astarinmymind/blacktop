import { observable, action } from 'mobx'
// import { CardStore } from '../card/CardStore';
import Card from '../card/card';

class Player {
    //playerId: number;
    //lobbyId: number = 0;
    name: string;
    icon: any;
    //hand: CardStore;
    //pointTotal: number;
   // isDead: boolean;
    
    constructor() {
        //this.playerId = 431;
        this.name = "";
        //this.icon = null;
        //this.hand = new CardStore();
        //this.pointTotal = 0;
        //this.isDead = false;
    }
}

export class PlayerStore {
    // array of Player Objects
    players: Player[] = []
    // array of Card Objects
    playerHand: Card[] = [];

    @observable lobbyId: number = 0;

    @action
    getPlayerHand = () => {
        return this.playerHand;
    }

    @action 
    getPlayers = () => {
        return this.players;
    }

    // pushes player onto player array 
    @action 
    addPlayer = () => {
        this.players.push(new Player());
    }

    @action
    setName = (newName: any, index: number) => {
        console.log(newName + " goes to " + this.players[index].name);
        this.players[index].name = newName;
    }

    @action
    setIcon = (newIcon: any, index: number) => {
        console.log(newIcon + " goes to " + this.players[0].icon);
       this.players[index].icon = newIcon;
    }
}