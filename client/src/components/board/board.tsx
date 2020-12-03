import React from 'react'
import { useDrop } from 'react-dnd'
import { CardTypes as CardTypes } from '../card/CardTypes'
import './board.css'

export const Board: React.FC = () => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: CardTypes.CARD,
    drop: () => ({ name: 'Dustbin' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = canDrop && isOver
  if (isActive) {
  } else if (canDrop) {
  }

  return (
    <div ref={drop} className="rectangle">
      {isActive ? 'Release to use' : 'Drag a card here to use'}
    </div>
  )
}
