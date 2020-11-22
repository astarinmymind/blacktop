import { observable, action, makeObservable } from 'mobx'
import { CardStore } from '../card/CardStore';

class Player {
    //playerId: number;
    //lobbyId: number = 0;
    name: string;
    //icon: any;
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

    // constructor() {
    //     makeObservable(this);
    // }

    // array of Player Objects
    @observable players: Player[] = []

    @observable lobbyId: number = 0

    // pushes player onto player array 
    // NOTE: temporary parameters
    @action 
    addPlayer = () => {
        this.players.push(new Player());
    }

    @action
    setName = (newName: string, index: number) => {
        console.log(newName + " goes to " + this.players[index].name);
        this.players[index].name = newName;
    }

    @action
    setIcon = (newIcon: any, index: number) => {
        //console.log(newIcon + " goes to " + this.players[0].icon);
       // this.players[index].icon = newIcon;
    }
}