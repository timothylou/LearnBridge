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
        backgroundColor: 'red',
        width: '100%',
        height: '100%',
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
