import { observable, action, makeObservable } from 'mobx'
import { CardStore } from '../card/CardStore';

class Player {
    id: number;
    name: string;
    icon: any;
    hand: CardStore;
    pointTotal: number;
    isDead: boolean;
    
    constructor() {
        this.id = 123456;
        this.name = "";
        this.icon = null;
        this.hand = new CardStore();
        this.pointTotal = 0;
        this.isDead = false;
    }
}

export class PlayerStore {

    constructor() {
        makeObservable(this);
    }
    
    // array of Player Objects
    @observable players: Player[] = []

    // pushes player onto player array 
    // NOTE: temporary parameters
    @action 
    addPlayer = () => {
        this.players.push(new Player());
    }

    @action
    setName = (event: any) => {
        console.log(event.target.value + " goes to " + this.players[0].name);
        this.players[0].name = event.target.value;
    }

    @action
    setIcon = (newIcon: any) => {
        console.log(newIcon + " goes to " + this.players[0].icon);
        this.players[0].icon = newIcon;
    }
}