import Card from './Card';
import React from 'react';
import {SEATS, SUITS, RANKS, RANK_VALUE_MAP} from '../constants/Game';

const CardsOnTable_divstyles = {
  [SEATS.NORTH]: {
    top: 0,
    left: "50%",
    marginLeft: -70,
  },
  [SEATS.SOUTH]: {
    bottom: 0,
    left: "50%",
    marginLeft: -70,
  },
  [SEATS.WEST]: {
    top: "50%",
    marginTop: -100,
    left: 0,
  },
  [SEATS.EAST]: {
    top: "50%",
    marginTop: -100,
    left: "",
    right: 0,
  }
}
const CardsOnTable = ({cardlist, cardHeight, cardWidth }) => {
  const reactcardslist = cardlist.map((elem, idx) => {
    const marginElem = (elem.player === SEATS.NORTH || elem.player === SEATS.SOUTH) ?
    {marginLeft: -1*cardWidth/2} : {marginTop: -1*cardHeight/2};
    console.log(marginElem);
    return (
      <Card
        rank={elem.card.rank}
        suit={elem.card.suit}
        zindex={idx}
        key={elem.card.suit+elem.card.rank}
        onClick={()=>{console.log('clicking on played cards does nothing');}}
        faceup={true}
        direction={elem.card.direction}
        offsetFromLeft={0}
        divstyle={{
          ...CardsOnTable_divstyles[elem.player],
          ...marginElem,
          width: cardWidth,
          height: cardHeight,
        }}
        imgstyle={{
          height: cardHeight,
          width: cardWidth,
        }}
      />
    );
  });
  return (
    <div>
      <div>
        {(reactcardslist.length > 0) && reactcardslist[0]}
      </div>
      <div>
        {(reactcardslist.length > 1) && reactcardslist[1]}
      </div>
      <div>
        {(reactcardslist.length > 2) && reactcardslist[2]}
      </div>
      <div>
        {(reactcardslist.length > 3) && reactcardslist[3]}
      </div>
    </div>
  );
}
export default CardsOnTable;
