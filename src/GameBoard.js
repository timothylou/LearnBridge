import React from 'react';
import Card, {RANK_VALUE_MAP, VALID_SUITS, VALID_RANKS} from './Card';
import Deck from './Deck';
import BridgeHand from './BridgeHand';
import {SEAT_NORTH, SEAT_SOUTH, SEAT_EAST, SEAT_WEST} from './Player';
import BridgeGameEngine from './BridgeGameEngine';
import BridgePlayingEngine from './BridgePlayingEngine';
import BridgeBiddingEngine from './BridgeBiddingEngine';

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
      cardsOnTable: new Array(),
      whoseTurn: this.props.dealer,
    };
    this.bridgeEngine = new BridgeGameEngine(this.props.dealer);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.onValidCardClick = this.onValidCardClick.bind(this);
    this.isValidCardClick = this.isValidCardClick.bind(this);
  }

  _nextPlayersTurn() {
    if (this.state.whoseTurn === SEAT_NORTH) this.setState({whoseTurn: SEAT_EAST});
    else if (this.state.whoseTurn === SEAT_EAST) this.setState({whoseTurn: SEAT_SOUTH});
    else if (this.state.whoseTurn === SEAT_SOUTH) this.setState({whoseTurn: SEAT_WEST});
    else if (this.state.whoseTurn === SEAT_WEST) this.setState({whoseTurn: SEAT_NORTH});
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async onValidCardClick(card, seat) {
    console.log('GameBoard: received validated click from ' + card.rank + ' of ' + card.suit +
      ' from ' + seat);
    this.bridgeEngine.playCard(card, seat);
    if (this.bridgeEngine.isTrickOver()) {
      const winner = this.bridgeEngine.getRoundWinner();
      this.setState({whoseTurn: winner});
      this.bridgeEngine.clearBoard();
      console.log('GameBoard: winner of round was: ' + winner);
    }
    else
      this._nextPlayersTurn();
    await this.sleep(1);
    console.log('GameBoard: next player: ' + this.state.whoseTurn);
  }
  isValidCardClick(card, seat, hand) {
    let isValid = (this.state.whoseTurn === seat) && this.bridgeEngine.isValidCard(card, hand);
    if (isValid) console.log('GameBoard: click from '+ card.rank + ' of ' + card.suit +
      ' from ' + seat + ' is VALID.');
    else console.log('GameBoard: click from '+ card.rank + ' of ' + card.suit +
      ' from ' + seat + ' is INVALID.');
    return (isValid);
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
            faceup={true}
            direction={'horizontal'}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
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
            direction={'horizontal'}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '50%',
          right: '10%',
          marginLeft: '0',
          border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <BridgeHand
            rawcardslist={this.state.eastHand}
            trumpSuit='h'
            seat={SEAT_EAST}
            faceup={true}
            direction={'vertical'}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '10%',
          marginLeft: '0',
          border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <BridgeHand
            rawcardslist={this.state.westHand}
            trumpSuit='h'
            seat={SEAT_WEST}
            faceup={true}
            direction={'vertical'}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
          />
        </div>
      </div>

    );
  }
}
