import React, { Component } from 'react';
import Deck from './Deck';
import {SEATS} from './constants/Game';
import ViewController from './containers/ViewController';
import { newGame } from './actions/actions';

class App extends Component {

  render() {
    return (
      <ViewController />
    );
  }
}

export default App;
