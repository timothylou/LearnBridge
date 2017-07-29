import Card from './Card';
import React from 'react';
import {SEATS, SUITS, RANKS, RANK_VALUE_MAP} from './constants/Game';


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
