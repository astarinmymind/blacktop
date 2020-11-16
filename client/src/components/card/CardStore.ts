/* Notes: 

Mobx:
    - store: (1) stores state properties (2) contains functions that modify state
    - creating observable state: 
        - @observable: defines trackable field that stores state
        - @action: marks method as modifying state 
*/

import { observable, action } from 'mobx'

export class CardStore {
    
    // array of tuples containing id (string) and points (number)
    @observable cards: [string, number][] = []

    // // load array of cards from server
    // // import { getCards } from './'
    // @action 
    // loadCards = () => {
    //     getCards().then(cards => this.cards = cards)
    // }

    // pushes tuple onto card array 
    // NOTE: add card will probably have no parameters and simply broadcast event to server
    @action 
    addCard = (type: string, point: number) => {
        var card: [string, number] = [type, point];
        this.cards.push(card)
    }
}