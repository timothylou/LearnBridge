import React from 'react';
import Card, {RANK_VALUE_MAP} from './Card';
import Deck from './Deck';
import BridgeHand from './BridgeHand';
import {SEAT_NORTH, SEAT_SOUTH, SEAT_EAST, SEAT_WEST} from './Player';
import BridgeGameEngine from './BridgeGameEngine';

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    const d = new Deck();
    d.shuffle();
    const hands = d.generateHands();
    this.state = {
      width: '0', height: '0',
      northHand: hands[0],
      eastHand: hands[1],
      southHand: hands[2],
      westHand: hands[3],
    };
    this.bridgeEngine = new BridgeGameEngine(SEAT_NORTH);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize',this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({width: window.innerWidth, height: window.innerHeight });
    console.log('width' + this.state.width.toString());
    console.log('height' + this.state.height.toString());
  }
  render() {

    return (
      <div>
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          marginLeft: '-10%',
          border: '3px solid #FF0000',
        }}>
          <BridgeHand
            rawcardslist={this.state.northHand}
            trumpSuit='h'
            seat={SEAT_NORTH}
            faceup={false}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '1%',
          left: '50%',
          marginLeft: '-10%',
          border: '3px solid #FF0000',
        }}>
          <BridgeHand
            rawcardslist={this.state.southHand}
            trumpSuit='h'
            seat={SEAT_SOUTH}
            faceup={true}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '50%',
          right: '10%',
          marginLeft: '0',
          border: '3px solid #FF0000',
          transform: 'rotate(90deg)',
        }}>
          <BridgeHand
            rawcardslist={this.state.eastHand}
            trumpSuit='h'
            seat={SEAT_EAST}
            faceup={false}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '10%',
          marginLeft: '0',
          border: '3px solid #FF0000',
          transform: 'rotate(270deg)',
        }}>
          <BridgeHand
            rawcardslist={this.state.westHand}
            trumpSuit='h'
            seat={SEAT_WEST}
            faceup={false}
          />
        </div>
      </div>

    );
  }
}
