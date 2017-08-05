import React from 'react';
import {connect} from 'react-redux';
import Deck from '../Deck';
import SmartPlayer from './SmartPlayer';
import CardsOnTable from '../components/CardsOnTable';
import BridgeGameEngine from '../BridgeGameEngine';
import {SUITS, RANKS, RANK_VALUE_MAP, SEATS} from '../constants/Game';
import { newGame, playCard, finishedTrick } from '../actions/actions';

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
      [SEATS.NORTH]: this.getAPIrepr_cards(hands[0]),
      [SEATS.SOUTH]: this.getAPIrepr_cards(hands[1]),
      [SEATS.EAST]: this.getAPIrepr_cards(hands[2]),
      [SEATS.WEST]: this.getAPIrepr_cards(hands[3]),
    };
    const { dispatch } = this.props;
    dispatch(newGame( 'N', {
      'N': this.sort('h',hands[0]),
      'S': this.sort('h',hands[1]),
      'E': this.sort('h',hands[2]),
      'W': this.sort('h',hands[3])
    }, ''));
    // this.sleep(1);
    this.bridgeEngine = new BridgeGameEngine(this.props.dealer);
    this.getAPIrepr_cards = this.getAPIrepr_cards.bind(this);
    this.getAPIrepr_playhistory = this.getAPIrepr_playhistory.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.registerValidCardPlay = this.registerValidCardPlay.bind(this);
    this.isValidCardClick = this.isValidCardClick.bind(this);
  }
  _sortSuitByRank(cardA, cardB) {
    return -(RANK_VALUE_MAP[cardA.rank] - RANK_VALUE_MAP[cardB.rank]);
  }
  sort(trumpsSuit, cards) {
    let sortedcards = [];
    let clubs = [];
    let diamonds = [];
    let hearts = [];
    let spades = [];

    for (let i=0; i < cards.length; i++) {
      switch(cards[i].suit) {
        case 'c':
          clubs.push(cards[i]);
          break;
        case 'd':
          diamonds.push(cards[i]);
          break;
        case 'h':
          hearts.push(cards[i]);
          break;
        case 's':
          spades.push(cards[i]);
          break;
        default:
          throw 'InvalidSuitError';
      }
    }
    clubs.sort(this._sortSuitByRank);
    diamonds.sort(this._sortSuitByRank);
    hearts.sort(this._sortSuitByRank);
    spades.sort(this._sortSuitByRank);

    if (trumpsSuit==='c') sortedcards = clubs.concat(diamonds,spades,hearts);
    else if (trumpsSuit==='d') sortedcards = diamonds.concat(clubs,hearts,spades);
    else if (trumpsSuit==='h') sortedcards = hearts.concat(spades,diamonds,clubs);
    else if (trumpsSuit==='s') sortedcards = spades.concat(hearts,clubs,diamonds);
    console.log(sortedcards);
    return sortedcards;
  }
  getAPIrepr_cards(cards) {
    let spades = '', hearts = '', diamonds = '', clubs = '';

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
    for (let i=0; i<this.props.history.length; i++) {
      repr += this.props.history[i].suit.toUpperCase() + this.props.history[i].rank.toUpperCase();
      if (i != this.props.history.length - 1)
        repr += "-"
    }
    return repr;
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  registerValidCardPlay(card, seat) {
    console.log('SmartTable::registerValidCardPlay: received validated card to play from', seat);
    this.bridgeEngine.playCard(card, seat);
    if (this.bridgeEngine.isTrickOver()) {
      const winner = this.bridgeEngine.getRoundWinner();
      this.props.dispatch(finishedTrick(winner));
      this.bridgeEngine.clearBoard(); // can wait until next trick starts to clear..
      console.log('SmartTable::registerValidCardPlay: winner of round was: ' + winner);
    }
  }
  isValidCardClick(card, seat) {
    const isValid = this.bridgeEngine.isValidCard(card, this.props.hands[seat]);
    if (isValid) console.log('SmartTable::isValidCardClick: VALID');
    else console.log('SmartTable::isValidCardClick: INVALID');
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
    console.log('SmartTable render');
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
            isValidCardClick={this.isValidCardClick}
            APIHandReps={this.APIHandReps}
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
            isValidCardClick={this.isValidCardClick}
            APIHandReps={this.APIHandReps}
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
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.EAST}
            partner={SEATS.WEST}
            bot={false}
            dummy={true}
            partnerIsBot={false}
            faceup={true}
            direction={'vertical'}
            registerValidCardPlay={this.registerValidCardPlay}
            isValidCardClick={this.isValidCardClick}
            APIHandReps={this.APIHandReps}
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
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.WEST}
            partner={SEATS.EAST}
            bot={false}
            dummy={false}
            partnerIsBot={false}
            faceup={true}
            direction={'vertical'}
            registerValidCardPlay={this.registerValidCardPlay}
            isValidCardClick={this.isValidCardClick}
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
    cardsOnTable: state.cardsOnTable
  }
};

export default connect(mapStateToProps)(SmartTable);
