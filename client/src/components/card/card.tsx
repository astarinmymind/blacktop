// /* Notes: 

// Context: used when data needs to be accessible by many components at different nesting levels 
// Provider: allows components to subscribe to context changes 

// */

import React from 'react'
import { usePlayerStore } from '../player/player';
import { useDrag, DragSourceMonitor } from 'react-dnd'
import { CardTypes } from '../card/CardTypes'
import './card.css'

import GameService from '../../services/GameService';

const gs = new GameService();

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
    if ((type === 'steal' || type === 'give') && playerStore.players[playerStore.currentPlayerIndex].lastPlayed !== 'give') {
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
      gs.socket.emit('cardPlayed', playerStore.lobbyId, playerStore.currentPlayerIndex, {type, points}, playerStore.opponentIndex);
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
