import React from 'react';
import Card from './Card';
import Deck from './Deck';
import BridgeHand from './BridgeHand';
import Player from './Player';
import BridgeGameEngine from './BridgeGameEngine';
import BridgePlayingEngine from './BridgePlayingEngine';
import BridgeBiddingEngine from './BridgeBiddingEngine';
import {SUITS, RANKS, RANK_VALUE_MAP, SEATS} from './constants/Game';

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
    this.playHistory = [];
    this.bridgeEngine = new BridgeGameEngine(this.props.dealer);
    this.getAPIrepr_cards = this.getAPIrepr_cards.bind(this);
    this.getAPIrepr_playhistory = this.getAPIrepr_playhistory.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.onValidCardClick = this.onValidCardClick.bind(this);
    this.isValidCardClick = this.isValidCardClick.bind(this);
  }
  getAPIrepr_cards(seat) {
    let spades = '', hearts = '', diamonds = '', clubs = '';
    let cards;
    if (seat === SEATS.NORTH) cards = this.state.northHand;
    else if (seat === SEATS.SOUTH) cards = this.state.southHand;
    else if (seat === SEATS.EAST) cards = this.state.eastHand;
    else if (seat === SEATS.WEST) cards = this.state.westHand;

    for (let i=0; i<cards.length; i++) {
      switch (cards[i].suit) {
        case SUITS.SPADES:
          spades += cards[i].rank;
          break;
        case SUITS.HEARTS:
          hearts += cards[i].rank;
          break;
        case SUITS.DIAMONDS:
          diamonds += cards[i].rank;
          break;
        case SUITS.CLUBS:
          clubs += cards[i].rank;
          break;
        default:
          console.log('dont go here please');
          break;
      }
    }
    return spades + '.' + hearts + '.' + diamonds + '.' + clubs;
  }
  getAPIrepr_playhistory() {
    let repr = "";
    for (let i=0; i<this.playHistory.length; i++) {
      repr += this.playHistory[i].suit.toUpperCase() + this.playHistory[i].rank.toUpperCase();
      if (i != this.playHistory.length - 1)
        repr += "-"
    }
    return repr;
  }
  _nextPlayersTurn() {
    if (this.state.whoseTurn === SEATS.NORTH)
      this.setState({whoseTurn: SEATS.EAST, numCardsPlayedN: this.state.numCardsPlayedN+1});
    else if (this.state.whoseTurn === SEATS.EAST)
      this.setState({whoseTurn: SEATS.SOUTH, numCardsPlayedE: this.state.numCardsPlayedE+1});
    else if (this.state.whoseTurn === SEATS.SOUTH)
      this.setState({whoseTurn: SEATS.WEST, numCardsPlayedS: this.state.numCardsPlayedS+1});
    else if (this.state.whoseTurn === SEATS.WEST)
      this.setState({whoseTurn: SEATS.NORTH, numCardsPlayedW: this.state.numCardsPlayedW+1});
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async onValidCardClick(card, seat) {
    console.log('GameBoard: received validated click from ' + card.rank + ' of ' + card.suit +
      ' from ' + seat);
    this.bridgeEngine.playCard(card, seat);
    this.playHistory.push(card);
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
    console.log('GameBoard:isValidCardClick: whoseturn: ' + this.state.whoseTurn);
    let isValid = (this.state.whoseTurn === seat) && this.bridgeEngine.isValidCard(card, hand);
    if (isValid) console.log('GameBoard: click from '+ card.rank + ' of ' + card.suit +
      ' from ' + seat + ' is VALID.');
    else console.log('GameBoard: click from '+ card.rank + ' of ' + card.suit +
      ' from ' + seat + ' is INVALID.');
    return isValid;
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
    //console.log('win width: ' + this.state.wwidth.toString());
    //console.log('win height: ' + this.state.wheight.toString());
  }
  render() {
    console.log('GameBoard render');
    console.log(this.state.wwidth*0.5);
    console.log(this.state.wwidth);
    return (
      <div>
        <div style={{
          position: 'absolute',
          top: '1%',
          left: '50%',
          marginLeft: -(140+30*12)/2,
          height: 200+10,
          width: (140+30*12)+6,
          border: '3px solid #FF0000',
        }}>
          <Player
            rawcardslist={this.state.northHand}
            isMyTurn={this.state.whoseTurn === SEATS.NORTH}
            trumpSuit='h'
            seatDirection={SEATS.NORTH}
            bot={true}
            dummy={false}
            partnerIsBot={false}
            partner={SEATS.SOUTH}
            faceup={true}
            direction={'horizontal'}
            offsetFromLeft={15*this.state.numCardsPlayedN}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
            getAPIHandRep={this.getAPIrepr_cards}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '1%',
          left: '50%',
          height: 200+10,
          width: (140+30*12)+6,
          marginLeft: -(140+30*12)/2,
          border: '3px solid #FF0000',
        }}>
          <Player
            rawcardslist={this.state.southHand}
            isMyTurn={this.state.whoseTurn === SEATS.SOUTH}
            trumpSuit='h'
            seatDirection={SEATS.SOUTH}
            partner={SEATS.NORTH}
            bot={false}
            dummy={false}
            partnerIsBot={true}
            faceup={true}
            direction={'horizontal'}
            offsetFromLeft={15*this.state.numCardsPlayedS}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
            getAPIHandRep={this.getAPIrepr_cards}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '1%',
          height: 200+10,
          width: (140+30*12)+6,
          marginTop: -(200)/2,
          border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <Player
            rawcardslist={this.state.eastHand}
            isMyTurn={this.state.whoseTurn === SEATS.EAST}
            trumpSuit='h'
            seatDirection={SEATS.EAST}
            partner={SEATS.WEST}
            bot={false}
            dummy={true}
            partnerIsBot={false}
            faceup={true}
            direction={'vertical'}
            offsetFromLeft={15*this.state.numCardsPlayedE}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
            getAPIHandRep={this.getAPIrepr_cards}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '1%',
          height: 200+10,
          width: (140+30*12)+6,
          marginTop: -(200)/2,
          border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <Player
            rawcardslist={this.state.westHand}
            isMyTurn={this.state.whoseTurn === SEATS.WEST}
            trumpSuit='h'
            seatDirection={SEATS.WEST}
            partner={SEATS.EAST}
            bot={false}
            dummy={false}
            partnerIsBot={false}
            faceup={true}
            direction={'vertical'}
            offsetFromLeft={15*this.state.numCardsPlayedW}
            onValidCardClick={this.onValidCardClick}
            isValidCardClick={this.isValidCardClick}
            getAPIHandRep={this.getAPIrepr_cards}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          left: '35%',
          top: '35%',
          height: '30%',
          width: '30%',
          border: '3px solid #FF0000',
        }}>

        </div>
      </div>

    );
  }
}
