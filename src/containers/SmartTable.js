import React from 'react';
import {connect} from 'react-redux';
import Deck from '../Deck';
import SmartPlayer from './SmartPlayer';
import CardsOnTable from '../components/CardsOnTable';
import {bridgeEngine} from '../BridgeGameEngine';
import {SUITS, RANKS, RANK_VALUE_MAP, SEATS} from '../constants/Game';
import { newGame, playCard, finishedTrick,
  clearBoard, incrementWhoseTurn,
  screenResize
} from '../actions/actions';
import {sortHand} from '../utilfns/HandFns';
import {getAPIrepr_cards, getAPIrepr_playhistory} from '../utilfns/APIFns';

class SmartTable extends React.Component {
  constructor(props) {
    super(props);
    console.log('SmartTable constructor called!');
    this.state = {
      wwidth: '0', wheight: '0',
    };

    const d = new Deck();
    d.shuffle();
    const hands=d.generateHands();
    this.APIHandReps = {
      [SEATS.NORTH]: getAPIrepr_cards(hands[0]),
      [SEATS.SOUTH]: getAPIrepr_cards(hands[1]),
      [SEATS.EAST]: getAPIrepr_cards(hands[2]),
      [SEATS.WEST]: getAPIrepr_cards(hands[3]),
    };
    this.props.dispatch(newGame( 'N', {
      'N': sortHand('h',hands[0]),
      'S': sortHand('h',hands[1]),
      'E': sortHand('h',hands[2]),
      'W': sortHand('h',hands[3])
    }, ''));
    // this.sleep(1);
    bridgeEngine.setDealer(this.props.dealer);
    bridgeEngine.setTrumpSuit('h');
    this.getAPIrepr_playhistory = this.getAPIrepr_playhistory.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.registerValidCardPlay = this.registerValidCardPlay.bind(this);
    this.isValidCardToPlay = this.isValidCardToPlay.bind(this);
  }

  getAPIrepr_playhistory() {
    return getAPIrepr_playhistory(this.props.history);
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  registerValidCardPlay(card, seat) {
    console.log('SmartTable::registerValidCardPlay: received validated card to play from', seat);
    bridgeEngine.playCard(card, seat);
    if (bridgeEngine.isTrickOver()) {
      const winner = bridgeEngine.getRoundWinner();
      this.props.dispatch(finishedTrick(winner));
      bridgeEngine.clearBoard(); // can wait until next trick starts to clear..
      console.log('SmartTable::registerValidCardPlay: winner of round was: ' + winner);
    }
    else {
      this.props.dispatch(incrementWhoseTurn());
    }
  }
  isValidCardToPlay(card, seat) {
    const isValid = bridgeEngine.isValidCard(card, this.props.hands[seat]);
    if (isValid) console.log('SmartTable::isValidCardToPlay: VALID');
    else console.log('SmartTable::isValidCardToPlay: INVALID');
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
    // this.setState({wwidth: window.innerWidth, wheight: window.innerHeight });
    this.props.dispatch(screenResize(window.innerWidth, window.innerHeight));
    //console.log('win width: ' + this.state.wwidth.toString());
    //console.log('win height: ' + this.state.wheight.toString());
  }
  render() {
    console.log('SmartTable render');
    const cardHeight = (this.props.screenHeight - this.props.screenHeight%50)/5;
    const cardWidth = cardHeight*7/10;
    return (
      <div style={{minWidth:"1000px"}}>
        <div style={{
          position: 'absolute',
          top: '1%',
          left: '50%',
          marginLeft: -(cardWidth+cardWidth/5*12)/2,
          height: cardHeight+10,
          width: (cardWidth+cardWidth/5*12)+6,
          border: '3px solid #FF0000',
        }}>
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.NORTH}
            bot={true}
            dummy={false}
            partnerIsBot={false}
            partner={SEATS.SOUTH}
            faceup={true}
            direction={'horizontal'}
            registerValidCardPlay={this.registerValidCardPlay}
            isValidCardToPlay={this.isValidCardToPlay}
            APIHandReps={this.APIHandReps}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '1%',
          left: '50%',
          height: cardHeight+10,
          width: (cardWidth+cardWidth/5*12)+6,
          marginLeft: -(cardWidth+cardWidth/5*12)/2,
          border: '3px solid #FF0000',
        }}>
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.SOUTH}
            partner={SEATS.NORTH}
            bot={false}
            dummy={false}
            partnerIsBot={true}
            faceup={true}
            direction={'horizontal'}
            registerValidCardPlay={this.registerValidCardPlay}
            isValidCardToPlay={this.isValidCardToPlay}
            APIHandReps={this.APIHandReps}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '1%',
          height: cardHeight+10,
          width: (cardWidth+cardWidth/5*12)+6,
          marginTop: -(cardHeight)/2,
          border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.EAST}
            partner={SEATS.WEST}
            bot={false}
            dummy={true}
            partnerIsBot={true}
            faceup={true}
            direction={'vertical'}
            registerValidCardPlay={this.registerValidCardPlay}
            isValidCardToPlay={this.isValidCardToPlay}
            APIHandReps={this.APIHandReps}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '1%',
          height: cardHeight+10,
          width: (cardWidth+cardWidth/5*12)+6,
          marginTop: -(cardHeight)/2,
          border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.WEST}
            partner={SEATS.EAST}
            bot={true}
            dummy={false}
            partnerIsBot={false}
            faceup={true}
            direction={'vertical'}
            registerValidCardPlay={this.registerValidCardPlay}
            isValidCardToPlay={this.isValidCardToPlay}
            APIHandReps={this.APIHandReps}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          left: '40%',
          top: '35%',
          height: '30%',
          width: '20%',
          border: '3px solid #FF0000',
        }}>
          <CardsOnTable
            cardlist={this.props.cardsOnTable}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
          />
        </div>
      </div>

    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    hands: state.hands,
    history: state.history,
    cardsOnTable: state.cardsOnTable,
    screenHeight: state.ui.screenHeight,
    screenWidth: state.ui.screenWidth,
  }
};

export default connect(mapStateToProps)(SmartTable);
