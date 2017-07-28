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
    console.log('GameBoard constructor called!');
    this.state = {
      wwidth: '0', wheight: '0',
      northHand: this.props.northHand,
      eastHand: this.props.eastHand,
      southHand: this.props.southHand,
      westHand: this.props.westHand,
      cardsOnTable: [],
      whoseTurn: this.props.dealer,
      trickswon_NS: 0,
      trickswon_EW: 0,
      numCardsPlayedN: 0,  // this is really just so we can recenter the cards
      numCardsPlayedS: 0,
      numCardsPlayedE: 0,
      numCardsPlayedW: 0,
    };
    this.bridgeEngine = new BridgeGameEngine(this.props.dealer);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.onValidCardClick = this.onValidCardClick.bind(this);
    this.isValidCardClick = this.isValidCardClick.bind(this);
  }

  _nextPlayersTurn() {
    if (this.state.whoseTurn === SEAT_NORTH)
      this.setState({whoseTurn: SEAT_EAST, numCardsPlayedN: this.state.numCardsPlayedN+1});
    else if (this.state.whoseTurn === SEAT_EAST)
      this.setState({whoseTurn: SEAT_SOUTH, numCardsPlayedE: this.state.numCardsPlayedE+1});
    else if (this.state.whoseTurn === SEAT_SOUTH)
      this.setState({whoseTurn: SEAT_WEST, numCardsPlayedS: this.state.numCardsPlayedS+1});
    else if (this.state.whoseTurn === SEAT_WEST)
      this.setState({whoseTurn: SEAT_NORTH, numCardsPlayedW: this.state.numCardsPlayedW+1});
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
      const trickNS = this.bridgeEngine.getNSScore();
      const trickEW = this.bridgeEngine.getEWScore();
      this.setState({
        whoseTurn: winner,
        trickswon_NS: trickNS,
        trickswon_EW: trickEW,
        numCardsPlayedN: trickNS+trickEW,
        numCardsPlayedS: trickNS+trickEW,
        numCardsPlayedE: trickNS+trickEW,
        numCardsPlayedW: trickNS+trickEW,
      });
      this.bridgeEngine.clearBoard(); // can wait until next trick starts to clear..
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
    this.setState({wwidth: window.innerWidth, wheight: window.innerHeight });
    console.log('win width: ' + this.state.wwidth.toString());
    console.log('win height: ' + this.state.wheight.toString());
  }
  render() {

    return (
      <div>
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          height: 200+10,
          width: (140+30*12)+6,
          marginLeft: '-25%',
          border: '3px solid #FF0000',
        }}>
          <BridgeHand
            rawcardslist={this.state.northHand}
            trumpSuit='h'
            seat={SEAT_NORTH}
            faceup={false}
            direction={'horizontal'}
            offsetFromLeft={15*this.state.numCardsPlayedN}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          height: 200+10,
          width: (140+30*12)+6,
          marginLeft: '-25%',
          border: '3px solid #FF0000',
        }}>
          <BridgeHand
            rawcardslist={this.state.southHand}
            trumpSuit='h'
            seat={SEAT_SOUTH}
            faceup={true}
            direction={'horizontal'}
            offsetFromLeft={15*this.state.numCardsPlayedS}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '50%',
          right: '25%',
          height: 200+10,
          width: (140+30*12)+6,
          marginLeft: '0%',
          border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <BridgeHand
            rawcardslist={this.state.eastHand}
            trumpSuit='h'
            seat={SEAT_EAST}
            faceup={false}
            direction={'vertical'}
            offsetFromLeft={15*this.state.numCardsPlayedE}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '1%',
          height: 200+10,
          width: (140+30*12)+6,
          marginLeft: '0',
          border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <BridgeHand
            rawcardslist={this.state.westHand}
            trumpSuit='h'
            seat={SEAT_WEST}
            faceup={false}
            direction={'vertical'}
            offsetFromLeft={15*this.state.numCardsPlayedW}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
          />
        </div>
      </div>

    );
  }
}
