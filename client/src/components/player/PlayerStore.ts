import { observable, action } from 'mobx'
// import { CardStore } from '../card/CardStore';
import Brickshay from '../../images/Brickshay.gif'

class Player {
    playerId: number;
    //lobbyId: number = 0;
    name: string;
    icon: any;
    //hand: CardStore;
    //pointTotal: number;
   // isDead: boolean;
    
    constructor(id: number) {
        this.playerId = id;
        this.name = "";
        this.icon = Brickshay;
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
    playerHand: string[] = [/*"nope", "give", "add1", "sub1", "nope", "draw", "see" */];

    @observable lobbyId: number = 0;

    @observable currentPlayer: Player = new Player(-1);

    @observable gameStarted: boolean = false;

    @action
    getPlayerHand = () => {
        return this.playerHand;
    }

    @action 
    getPlayers = () => {
        var playerArray:  Player[] = [];
        for (var playerID in this.players) {
            playerArray.push(this.players[playerID]);
        }
        return playerArray;
    }

    // pushes player onto player array 
    @action 
    addPlayer = (id: number) => {
        this.players[id] = new Player(id);
    }

    @action
    setName = (newName: any, id: number) => {
        // console.log(newName + " goes to " + this.players[index].name);
        this.players[id].name = newName;
    }

    @action
    setIcon = (newIcon: any, id: number) => {
        // console.log(newIcon + " goes to " + this.players[index].icon);
        this.players[id].icon = newIcon;
    }

    @action 
    drawCard = (card: string) => {
        this.playerHand.push(card);
        console.log(this.playerHand);
    }
}