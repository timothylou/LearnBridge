import React, { Component } from 'react';
import Card, {VALID_SUITS} from './Card';
import BridgeHand from './BridgeHand';
import Deck from './Deck';
import GameBoard from './GameBoard';

class App extends Component {
  render() {
    // return (
    //   <div className="App">
    //     <div className="App-header">
    //       <h2>Welcome to React</h2>
    //     </div>
    //     <p className="App-intro">
    //       To get started, edit <code>src/App.js</code> and save to reload.
    //     </p>
    //   </div>
    // );
    const d = new Deck();
    d.shuffle();
    const hands=d.generateHands();
    return (
      <div style={{
        backgroundColor: 'red',
        width: '100%',
        height: '100%',
      }}>
        <GameBoard/>
      </div>
    )

    // return (
    //   <BridgeHand
    //     rawcardslist={hands[0]}
    //     trumpSuit='h'
    //   />
    // );
  }
}

export default App;
