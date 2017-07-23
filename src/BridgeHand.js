import React from 'react';
import Card, {RANK_VALUE_MAP} from './Card';
import Deck from './Deck';

export default class BridgeHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: this.props.rawcardslist,
      inThisHand: false
    };
    this.onCardClick = this.onCardClick.bind(this);
    this.removeCard = this.removeCard.bind(this);
  }

  _sortSuitByRank(cardA, cardB) {
    return -(RANK_VALUE_MAP[cardA.rank] - RANK_VALUE_MAP[cardB.rank]);
  }
  getCards() {
    return this.state.cards;
  }
  removeCard(card) {
    let newcardlist = new Array();
    for (let i=0; i < this.state.cards.length; i++) {
      if (this.state.cards[i].suit !== card.suit || this.state.cards[i].rank !== card.rank) {
        newcardlist.push(this.state.cards[i]);
      }
    }
    this.setState({ cards: newcardlist } );
  }
  onCardClick(crank, csuit) {
    console.log('BridgeHand: Card ' + crank + ' of ' + csuit + ' clicked!');
    if (this.props.isValidCardClick({rank: crank, suit: csuit}, this.props.seat,
      this.state.cards)) {
        this.props.onValidCardClick({rank: crank, suit: csuit}, this.props.seat);
        this.removeCard({rank: crank, suit: csuit});
    }
  }
  sort(trumpsSuit) {
    let sortedcards = [];
    let clubs = [];
    let diamonds = [];
    let hearts = [];
    let spades = [];

    for (let i=0; i < this.state.cards.length; i++) {
      switch(this.state.cards[i].suit) {
        case 'c':
          clubs.push(this.state.cards[i]);
          break;
        case 'd':
          diamonds.push(this.state.cards[i]);
          break;
        case 'h':
          hearts.push(this.state.cards[i]);
          break;
        case 's':
          spades.push(this.state.cards[i]);
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
    this.setState({cards: sortedcards});
  }
  componentWillMount() {
    this.sort(this.props.trumpSuit);
  }
  render() {
    const reactcardslist = this.state.cards.map((card, idx) => {
      return (
          <Card
            rank={card.rank}
            suit={card.suit}
            zindex={idx}
            key={card.suit+card.rank}
            onClick={this.onCardClick}
            faceup={this.props.faceup}
            direction={this.props.direction}
          />
      );
    });
    return (
      <div style={{
        height: '200px',
        width: (140+30*(this.state.cards.length-1)).toString() + 'px',
        border: '3px solid #73AD21',
        transform: 'rotate(0deg)',
      }}>
        {reactcardslist}
      </div>
    );
  }
}
