/*
Notes: 
  -useObserver: used to observe values from store
  -React Fragment (notation: <> </> )  
    - allows component to return multiple elements
    - let you group a list of children without adding extra nodes to the DOM
*/

  import React from "react";
  import { usePlayerStore } from '../player/player';
  import { useObserver } from 'mobx-react-lite';
  import { Card } from '../card/card';
  import { Board } from '../board/board';
  import { DndProvider } from 'react-dnd';
  import { HTML5Backend } from 'react-dnd-html5-backend';
  import { Link } from "react-router-dom";
  import './game.css';
  import NopeCard from '../../images/TestCard.png';
  import SkipCard from '../../images/SkipCard.png';
  import Add1Card from '../../images/ADD1.png';
  import Add10Card from '../../images/Add10.png';
  import Sub1Card from '../../images/SUB1.png';
  import Sub10Card from '../../images/Sub10.png';
  import DrawCard from '../../images/DrawCard.png';
  import GiveCard from '../../images/GiveCard.png';
  import SeeCard from '../../images/PeekCard.png';
  import StealCard from '../../images/StealCard.png'
  import TestLogo from '../../images/TestLogo.png';
  import ChalkLine from '../../images/ChalkLine.png';
  
  import { GameService } from '../../services/GameService.js';
  
  const gs = new GameService();
  
  //address of the server
  export const Game = () => {
    // gets store
    const {playerStore} = usePlayerStore();
  
    // emits socket event that player has pressed end turn
    async function endTurn() 
    {
      if (playerStore.turnNumber % playerStore.players.length !== playerStore.currentPlayerIndex) {
        alert("It is not your turn!");
      }
      else if (playerStore.playerHand.length >= 7) {
        alert("You must play cards until you have less than 7 cards in your hand!");
      }
      else {
        gs.socket.emit("turnEnded", playerStore.lobbyId, playerStore.currentPlayerIndex);
      }
    }
  
    function setImage(card) 
    {
      switch (card.type) {
          case "nope":
              return NopeCard;
          case "add":
              return setImageAdd(card);
          case "subtract":
              return setImageSub(card);
          case "give":
              return GiveCard;
          case "see future":
              return SeeCard;
          case "draw 2":
              return DrawCard;
          case "skip":
              return SkipCard;
          case "steal":
              return StealCard;
          default: 
              break;
      }
      return;
    }
    function setImageAdd(card) {
      if (card.points < 10) {
        return Add1Card;
      }
      else {
        return Add10Card
      }
    }
    function setImageSub(card) {
      if (card.points > -10) {
        return Sub1Card;
      }
      else {
        return Sub10Card
      }
    }
     
     const [victorIndex, setVictorIndex] = React.useState(0);
     const [gameFinished, setGameFinished] = React.useState(false);
     const [gameTied, setGameTied] = React.useState(false);
     const [dummy, setDummy] = React.useState({});
     React.useEffect(() => {
  
      // update player hand after draw/play Card Event
      gs.socket.on("playerHand", function(data) {
          playerStore.playerHand = data.hand;
          setDummy({});
      });
  
      // update player points 
      gs.socket.on("allScores", function(data) {
        playerStore.point = data;
        let count = 0;
        for (let point of data) {
          if (point >= 100)
            count = count + 1
        } 
        if (count === data.length) {
          setGameTied(true);
        }
        setDummy({});
      });
  
      // event notification: nope, give, see, draw2 event
      gs.socket.on("eventNotification", function(data) {
          textLog.push(data);
          setDummy({});
      });

      // event notification: end of turn event
      gs.socket.on("endTurnNotification", function(data) {
        textLog.push(data);
        setDummy({});
      })
  
      // A winner is decided and the index of the victorious player is passed in
      gs.socket.on("results", function(data) {
        if (data === -1)
          setGameTied(true);
        else
          setVictorIndex(data);
        setGameFinished(true);
      });
  
      gs.socket.on("turnCount", function(data) {
        playerStore.turnNumber = data;
      });

      gs.socket.on("seeFuture", function(data) {
        textLog.push('the next three cards are: \n')
        for (let card of data) {
          if (card.type === "add" || card.type === "subtract")
            textLog.push(card.type + ' ' + card.points + '\n')
          else
            textLog.push(card.type + '\n')
        }
      });

    }, []);
  
    // When a player clicks an icon on the list of players, their opponent is set to the selected player (unless it's themself)
    function selectOpponent(newOpponentIndex: number)
    {
      if (newOpponentIndex !== playerStore.currentPlayerIndex) {
        playerStore.opponentIndex = newOpponentIndex;
        textLog.push(`You selected ${playerStore.players[playerStore.opponentIndex].name} as your opponent for your give/steal cards!\n`);
      }
      else {
        alert("You cannot select yourself as the oppoenent of your give/steal cards!")
      }
      setDummy({});
    }
    
    const [textLog, setTextLog] = React.useState(["Welcome to Blacktop!\nYou can select your target for give/steal cards by clicking on an icon on the right.\n"]);
    function eventsLog() {
      return (
        <div className="events-box">
          <p>
            {textLog}
          </p>
        </div>
      );
    }

    function gamePage() {
      console.log(playerStore.playerHand);
      return (
        <DndProvider backend={HTML5Backend}>
          <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0, height: '100vh'}} className="sendNotification">
            <div className="game-columns">
              <div> {/* Column 1 */}
                <img src={playerStore.players[playerStore.currentPlayerIndex].icon} className="flip-img" alt="Current Player" />
                <h1>{playerStore.players[playerStore.currentPlayerIndex].name}</h1>
                <div>
                  <button onClick={endTurn}> Draw and <br />End Turn</button>
                </div>
              </div>
              <div style={{display: 'flex'}}> {/* Column 2 */}
                <Board />
                {eventsLog()}
              </div>
              <div className="list">  {/* Column 3 */}
                {playerStore.getPlayers().map((element, i) => 
                  <div style={{marginBottom: '3vw'}}>
                    <img alt="icon" src={element.icon} onClick={() => selectOpponent(i)}/>
                    {element.name}
                    <p>Score: {playerStore.getPoints()[i] ? playerStore.getPoints()[i] : 0}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="hand">
              {Array.from(playerStore.playerHand).map(card => 
                  <Card type={card.type} points={card.points} src={setImage(card)}/>
              )}
            </div>
          </div>
        </DndProvider>
      );
    }
    
    // The results page that only displays if the game has finished
    function resultsPage() {
      let winStatus: string;
      if (gameTied) {
        winStatus = 'Draw!'
      }
      else if (playerStore.players[victorIndex].name === playerStore.players[playerStore.currentPlayerIndex].name) {
        winStatus = 'Victory!'
      }
      else {
        winStatus = "Defeat!"
      }
      
      return(
        <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0, minHeight: '100vh'}}>
          <img src={ TestLogo } alt="logo" className="logo" />
          <img src={ ChalkLine } alt="line" className="line" />
          <div className="results">
            <h1>{winStatus}</h1>
            { !gameTied ? <img src={playerStore.players[victorIndex].icon} alt="Victor"/> : null }
            <h1>{gameTied ? null : playerStore.players[victorIndex].name}</h1>
            <Link to={{ pathname: '/', state:{ consent:'true'} }} >
              <button onClick={playerStore.reset}>Go Home</button>
            </Link>
          </div>
        </div>
      );
    }
  
    return useObserver(() => (
      (gameFinished || gameTied) ? resultsPage() : gamePage()
    ));
  }
  export default Game;