import { observable, action } from 'mobx'

export class CardStore {
    
    // array of tuples containing id (string) and points (number)
    @observable cards: [string, number][] = []

    // // load array of cards
    // @action 
    // loadCards = () => {
    //     getCards().then(cards => this.cards = cards)
    // }

    // pushes tuple onto card array
    @action 
    addCard = (type: string, point: number) => {
        var card: [string, number] = [type, point];
        this.cards.push(card)
    }
}