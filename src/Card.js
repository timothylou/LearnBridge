import React from 'react';
import styles from './styles/CardStyles.css';

const SUIT_CLUBS = 'c';
const SUIT_DIAMONDS = 'd';
const SUIT_HEARTS = 'h';
const SUIT_SPADES = 's';
const VALID_SUITS = [SUIT_CLUBS, SUIT_DIAMONDS, SUIT_HEARTS, SUIT_SPADES];
const VALID_RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const RANK_VALUE_MAP = {
  '2': 2,  '3': 3,  '4' : 4,
  '5': 5,  '6': 6,  '7' : 7,
  '8': 8,  '9': 9,  '10': 10,
  'J': 11, 'Q': 12, 'K' : 13,
  'A': 14,
};

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    console.log('Card constructor called!');
    console.log(props);
    this.value = RANK_VALUE_MAP[this.props.rank];
    this.name = this.props.rank + " of " + this.props.suit;
  }

  render() {
    console.log(this.name);
    console.log((10*this.props.zindex).toString() + 'px');
    let cardimg = this.props.faceup ?
     require('./cardimages/'+this.value.toString()+this.props.suit.toUpperCase()+'.png')
     : require('./cardimages/back_card.gif');

    return (
      <div style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        boxSizing: 'border-box',
        color: '#FF5722',
        position: 'absolute',
        left: (30*this.props.zindex).toString() + 'px',
        padding: 0,
        width: "140px",
        height: '200px',
        zIndex: this.props.zindex,
      }}>
        <img
          src={cardimg}
          onClick={()=>{console.log('hi ' + this.name);
                        this.props.onClick(this.props.rank, this.props.suit);}}
          width="140px"
          height="200px"
          alt="the card was supposed to show up"
        />
      </div>
    );
  }
}

export { Card, VALID_SUITS, VALID_RANKS, RANK_VALUE_MAP };
