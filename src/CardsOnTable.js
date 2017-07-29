import Card, {RANK_VALUE_MAP, VALID_SUITS, VALID_RANKS,
  SUIT_CLUBS, SUIT_DIAMONDS, SUIT_HEARTS, SUIT_SPADES} from './Card';
import React from 'react';


function CardsOnTable(props) {
  const reactcardslist = props.cardlist.map((card, idx) => {
    return (
      <Card
        rank={card.rank}
        suit={card.suit}
        zindex={idx}
        key={card.suit+card.rank}
        onClick={this.onCardClick}
        faceup={true}
        direction={card.direction}
        offsetFromLeft={0}
      />
    );
  });
  return (

  )
}
