// /* Notes: 

// Context: used when data needs to be accessible by many components at different nesting levels 
// Provider: allows components to subscribe to context changes 

// */

import React from 'react'
import { usePlayerStore } from '../player/player';
import { useDrag, DragSourceMonitor } from 'react-dnd'
import { CardTypes } from '../card/CardTypes'
// import NopeCard from './images/NOPE.png'
// import AddCard from './images/ADD1.png'
// import SubCard from './images/SUB1.png'
// import DrawCard from './images/DRAW.png'
// import GiveCard from './images/GIVE.png'
// import SeeCard from './images/SEE.png'
// import { CardStore } from './CardStore'
import './card.css'

import GameService from '../../services/GameService';

const gs = new GameService();

// // defines type for context value 
// // note: typescript allows classes as types
// type CardContextValue = {
//     cardStore: CardStore
// }

// // defines context with React.createContext
// // pass in type argument and default value {}
// const CardContext = React.createContext<CardContextValue>({} as CardContextValue)

// // initialize store
// const cardStore = new CardStore() 

// // exports context provider 
// /* A Note on Syntax: 
//     - we are annotating function type: 'This variable holds a function: React Functional Component'
//     - child is of type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
// */
// export const CardProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
//     return (
//         <CardContext.Provider value ={{ cardStore }}>
//             {children}
//         </CardContext.Provider>
//     );
// };

// // defines helper hook
// /*
// useContext: 
//     - accepts a context object (the value returned from React.createContext) 
//     - returns current context value for that context
//     - current context value is determined by the value prop of the nearest 
//       <MyContext.Provider> above the calling component in the tree

// When the nearest <MyContext.Provider> above the component updates, 
// this Hook will trigger a rerender with the latest context value passed to that 
// MyContext provider. 
// */
// export const useCardStore = () => React.useContext(CardContext)

interface CardProps {
  type: string;
  points: number;
  src: any;
}

export const Card: React.FC<CardProps> = ({ type, points, src }) => {
  const {playerStore} = usePlayerStore();

  // emits socket event that player has played a card
  function playCard() {
    // console.log(name);
    if (playerStore.turnNumber % playerStore.players.length !== playerStore.currentPlayerIndex && type !== 'nope') {
      alert('You can only play a card on your turn, unless you are playing a NOPE card!');
      return;
    }
    if ((type === 'steal' || type === 'give') && (playerStore.players[playerStore.currentPlayerIndex].lastPlayed !== 'steal' &&
    playerStore.players[playerStore.currentPlayerIndex].lastPlayed !== 'give')) {
      if (playerStore.opponentIndex >= 0) {
        playerStore.setLastPlayed(type, playerStore.currentPlayerIndex);
        gs.socket.emit('cardPlayed', playerStore.lobbyId, playerStore.currentPlayerIndex, {type, points}, playerStore.opponentIndex);
      }
      else {
        alert('You must select an opponent to play give/steal cards! Click an icon on the right.');
      }
    }
    else {
      playerStore.setLastPlayed(type, playerStore.currentPlayerIndex);
      gs.socket.emit('cardPlayed', playerStore.lobbyId, playerStore.currentPlayerIndex, {type, points}, -1);
    }
  }

  // implementation od react-dnd based on their dustbin example
  const [{ isDragging }, drag] = useDrag({
    item: { name: type, type: CardTypes.CARD },
    end: (card: { name: string } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult()
      if (card && dropResult) {
        // alert(`You used ${card.name}!`)
        playCard();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1

  return (
    <div ref={drag} className='card'>
      <img alt='card' src={src} style={{opacity: opacity}} />
    </div>
  )
}


// function setImage(Card c) 
// {
//     let cardType : string = c.name
//     switch (cardType) {
//         case 'nope':
//             c.picture = NopeCard;
//             break;
//         case 'add1':
//             c.picture = AddCard;
//             break;
//         case 'sub1':
//             c.picture = SubCard;
//             break;
//         case 'give':
//             c.picture = GiveCard;
//             break;
//         case 'see':
//             c.picture = SeeCard;
//             break;
//         case 'draw':
//             c.picture = DrawCard;
//             break;
//         default: 
//             break;
//     }
// }