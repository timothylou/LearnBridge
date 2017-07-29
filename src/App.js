import React, { Component } from 'react';
import Card, {VALID_SUITS} from './Card';
import BridgeHand from './BridgeHand';
import Deck from './Deck';
import GameBoard from './GameBoard';
import {SEAT_NORTH, SEAT_SOUTH, SEAT_EAST, SEAT_WEST} from './Player';

class App extends Component {
  render() {
    const d = new Deck();
    d.shuffle();
    const hands=d.generateHands();
    return (
      <div style={{
        backgroundColor: 'white',
        position: 'absolute',
        width: '75%',
        height: '80%',
        top: '5%',
        left: '5%',
        border: '4px solid #00FFFF',
        id: 'gameboardidtest'
      }}>
        <GameBoard
          dealer={SEAT_NORTH}
          northHand={hands[0]}
          southHand={hands[1]}
          eastHand={hands[2]}
          westHand={hands[3]}
        />
      </div>
    );
  }
}

export default App;
