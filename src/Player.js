import React from 'react';
import BridgeHand from './BridgeHand';
import Card, {RANK_VALUE_MAP, VALID_SUITS, VALID_RANKS,
  SUIT_CLUBS, SUIT_DIAMONDS, SUIT_HEARTS, SUIT_SPADES} from './Card';


export const SEAT_NORTH = 'N';
export const SEAT_SOUTH = 'S';
export const SEAT_EAST  = 'E';
export const SEAT_WEST  = 'W';

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.seatDirection = this.props.seatDirection;
    this.isBot = this.props.bot; // boolean
    this.state = {
      cards: this.sort('h',this.props.rawcardslist),
      numCardsPlayed: 0, // could just calculate this based on length of cards
      isMyTurn: this.props.isMyTurn,
    };

  }
  _sortSuitByRank(cardA, cardB) {
    return -(RANK_VALUE_MAP[cardA.rank] - RANK_VALUE_MAP[cardB.rank]);
  }
  removeCard(card) {
    let newcardlist = [];
    for (let i=0; i < this.state.cards.length; i++) {
      if (this.state.cards[i].suit !== card.suit || this.state.cards[i].rank !== card.rank) {
        newcardlist.push(this.state.cards[i]);
      }
    }
    this.setState({ cards: newcardlist } );
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

  componentDidUpdate(prevProps, prevState) {
    if (this.isBot && !prevState.isMyTurn && this.state.isMyTurn) {
      //make api call
    }
  }
  getAPIrepr_cards() { // maybe can just save results and recalc as appropriate
    let spades = '', hearts = '', diamonds = '', clubs = '';
    for (let i=0; i<this.state.cards.length; i++) {
      switch (this.state.cards[i].suit) {
        case SUIT_SPADES:
          spades += this.state.cards[i].rank;
          break;
        case SUIT_HEARTS:
          hearts += this.state.cards[i].rank;
          break;
        case SUIT_DIAMONDS:
          diamonds += this.state.cards[i].rank;
          break;
        case SUIT_CLUBS:
          clubs += this.state.cards[i].rank;
          break;
        default:
          console.log('dont go here please');
          break;
      }
    }
    return spades + '.' + hearts + '.' + diamonds + '.' + clubs;
  }

  render() {
    return (
      <BridgeHand
        rawcardslist={this.state.cards}
        trumpSuit='h'
        seat={this.seatDirection}
        faceup={this.props.faceup}
        direction={'horizontal'}
        offsetFromLeft={15*this.state.numCardsPlayed}
        onValidCardChosen={this.onValidCardClick}
        isValidCardClick={this.isBot ? ((a,b,c)=> {return false;}) : this.props.isValidCardClick}
      />
    );
  }
}
