import { observable, action } from 'mobx'
import { CardStore } from '../card/CardStore';

type Player = {
    id: number,
    name: string,
    hand: CardStore,
    pointTotal: number,
    isDead: boolean
}

export class PlayerStore {
    
    // array of Player Objects
    @observable players: Player[] = []

    // pushes player onto player array 
    // NOTE: temporary parameters
    @action 
    addPlayer = () => {
        this.players.push()
    }
}