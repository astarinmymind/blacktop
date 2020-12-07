/*
Notes: 
  -useObserver: used to observe values from store
  -React Fragment (notation: <> </> )  
    - allows component to return multiple elements
    - let you group a list of children without adding extra nodes to the DOM
*/

// import { CardStore } from "../card/CardStore";
  
//export const Game = () => {
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
  import Add2Card from '../../images/ADD1.png';
  import Add3Card from '../../images/ADD1.png';
  import Add4Card from '../../images/ADD1.png';
  import Add5Card from '../../images/ADD1.png';
  import Add6Card from '../../images/ADD1.png';
  import Add7Card from '../../images/ADD1.png';
  import Add8Card from '../../images/ADD1.png';
  import Add9Card from '../../images/ADD1.png';
  import Add10Card from '../../images/Add10.png';
  import Add11Card from '../../images/Add10.png';
  import Add12Card from '../../images/Add10.png';
  import Add13Card from '../../images/Add10.png';
  import Add14Card from '../../images/Add10.png';
  import Add15Card from '../../images/Add10.png';
  import Add16Card from '../../images/Add10.png';
  import Add17Card from '../../images/Add10.png';
  import Add18Card from '../../images/Add10.png';
  import Add19Card from '../../images/Add10.png';
  import Add20Card from '../../images/Add10.png';
  import Sub1Card from '../../images/SUB1.png';
  import Sub2Card from '../../images/SUB1.png';
  import Sub3Card from '../../images/SUB1.png';
  import Sub4Card from '../../images/SUB1.png';
  import Sub5Card from '../../images/SUB1.png';
  import Sub6Card from '../../images/SUB1.png';
  import Sub7Card from '../../images/SUB1.png';
  import Sub8Card from '../../images/SUB1.png';
  import Sub9Card from '../../images/SUB1.png';
  import Sub10Card from '../../images/Sub10.png';
  import Sub11Card from '../../images/Sub10.png';
  import Sub12Card from '../../images/Sub10.png';
  import Sub13Card from '../../images/Sub10.png';
  import Sub14Card from '../../images/Sub10.png';
  import Sub15Card from '../../images/Sub10.png';
  import Sub16Card from '../../images/Sub10.png';
  import Sub17Card from '../../images/Sub10.png';
  import Sub18Card from '../../images/Sub10.png';
  import Sub19Card from '../../images/Sub10.png';
  import Sub20Card from '../../images/Sub10.png';
  import DrawCard from '../../images/DrawCard.png';
  import GiveCard from '../../images/GiveCard.png';
  import SeeCard from '../../images/PeekCard.png';
  import StealCard from '../../images/StealCard.png'
  import TestLogo from '../../images/TestLogo.png';
  import ChalkLine from '../../images/ChalkLine.png';
  
  import GameService from '../../services/GameService';
  
  const gs = new GameService();
  
  //Just a random ID i used to test that each client was different
  // var id = Math.floor(Math.random() * 100);
  
  //address of the server
  export const Game = () => {
    //this is syntax I use to set variables, setTitle being the way to change them
  
    // gets store
    // const {cardStore} = useCardStore()
    const {playerStore} = usePlayerStore();
  
    // emits socket event that player has pressed end turn
    function endTurn() 
    {
      if (playerStore.turnNumber % playerStore.players.length !== playerStore.currentPlayerIndex) {
        alert("It is not your turn!");
        return;
      }
  
      let nextPlayer: string = playerStore.players[playerStore.currentPlayerIndex+1] ? 
        playerStore.players[playerStore.currentPlayerIndex+1].name : 
        playerStore.players[0].name;

      let endTurnNotification: string = playerStore.players[playerStore.currentPlayerIndex].name + ' ended their turn. \n'
        + 'It is now ' + nextPlayer + '\'s turn. \n';
  
      gs.socket.emit("cardDrawn", playerStore.lobbyId, playerStore.currentPlayerIndex);
      gs.socket.emit("turnEnded", playerStore.lobbyId, playerStore.currentPlayerIndex, endTurnNotification);
    }
  
    function setImage(card) 
    {
      // console.log(card);
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
      switch (card.points) {
        case 1:
          return Add1Card;
        case 2:
          return Add2Card;
        case 3:
          return Add3Card;
        case 4:
          return Add4Card;
        case 5:
          return Add5Card;
        case 6:
          return Add6Card;
        case 7:
          return Add7Card;
        case 8:
          return Add8Card;
        case 9:
          return Add9Card;
        case 10:
          return Add10Card;
        case 11:
          return Add11Card;
        case 12:
          return Add12Card;
        case 13:
          return Add13Card;
        case 14:
          return Add14Card;
        case 15:
          return Add15Card;
        case 16:
          return Add16Card;
        case 17:
          return Add17Card;
        case 18:
          return Add18Card;
        case 19:
          return Add19Card;
        case 20:
          return Add20Card;
        default:
          return;
      }
    }
    function setImageSub(card) {
      switch (card.points) {
        case -1:
          return Sub1Card;
        case -2:
          return Sub2Card;
        case -3:
          return Sub3Card;
        case -4:
          return Sub4Card;
        case -5:
          return Sub5Card;
        case -6:
          return Sub6Card;
        case -7:
          return Sub7Card;
        case -8:
          return Sub8Card;
        case -9:
          return Sub9Card;
        case -10:
          return Sub10Card;
        case -11:
          return Sub11Card;
        case -12:
          return Sub12Card;
        case -13:
          return Sub13Card;
        case -14:
          return Sub14Card;
        case -15:
          return Sub15Card;
        case -16:
          return Sub16Card;
        case -17:
          return Sub17Card;
        case -18:
          return Sub18Card;
        case -19:
          return Sub19Card;
        case -20:
          return Sub20Card;
        default:
          return;
      }
    }
     
     const [lastFive, setLastFive] = React.useState([{}, {}, {}, {}, {}]);
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
          if (point > 100)
            count = count + 1
        } 
        if (count === data.length) {
          setGameTied(true);
        }
        setDummy({});
      });
  
      // event notification: nope, give, see, draw event
      gs.socket.on("eventNotification", function(data) {
          var name = playerStore.players[data[0]].name
          textLog.push(name + ' ' + 'played ' + data[1].type + '\n')
          setDummy({});
      });

      gs.socket.on("endTurnNotification", function(data) {
        textLog.push(data);
        setDummy({});
      })
  
      // @NICK: last card played for display
      gs.socket.on("lastCardPlayed", function(data) {
        setLastFive([data, lastFive[0], lastFive[1], lastFive[2], lastFive[3]]);
      });
      
      // This is for when the client recieves another hand from the server
      gs.socket.on("otherHand", function(data) {
      });
  
      // A winner is decided and the index of the victorious player is passed in
      gs.socket.on("results", function(data) {
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
        // renders an unordered list of cards
        //button with the variable grabbed from the server
        <DndProvider backend={HTML5Backend}>
          <div style={{backgroundColor: "rgb(14, 14, 14)", margin: 0, height: '100vh'}} className="sendNotification">
            <div className="game-columns">
              <div>
                <img src={playerStore.players[playerStore.currentPlayerIndex].icon} className="flip-img" alt="Current Player" />
                <h1>{playerStore.players[playerStore.currentPlayerIndex].name}</h1>
                <div>
                  <button onClick={endTurn}> Draw & <br />End Turn</button>
                </div>
              </div>
              <div style={{display: 'flex'}}>
                <Board />
                {eventsLog()}
              </div>
              <div className="list">
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
              {Array.from(playerStore.getPlayerHand()).map(card => 
                  <Card name={card.type} src={setImage(card)}/>
              )}
            </div>
          </div>
        </DndProvider>
      );
    }
  
    function resultsPage() {
      // playerStore.gameStarted = false;

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
            <h1>{playerStore.players[victorIndex].name}</h1>
            <Link to={{ pathname: '/', state:{ consent:'true'} }} >
              <button>Go Home</button>
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
  
  function sendId() {
    //sending the ID to the server so you can print it
    //socket.emit("ID", id);
  }