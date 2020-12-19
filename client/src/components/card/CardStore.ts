/* Notes: 

Mobx:
    - store: (1) stores state properties (2) contains functions that modify state
    - creating observable state: 
        - @observable: defines trackable field that stores state
        - @action: marks method as modifying state 
*/

import { observable, action, makeObservable } from 'mobx'

export class CardStore {
    
    constructor() {
        makeObservable(this);
    }

    // array of tuples containing id (string) and points (number)
    @observable cards: [string, number][] = []

    // pushes tuple onto card array 
    @action 
    addCard = (type: string, point: number) => {
        var card: [string, number] = [type, point];
        this.cards.push(card)
    }
}