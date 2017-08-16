import React from 'react';
import {Card_h, Card_v} from '../constants/Style';
import {SUITS, RANKS, RANK_VALUE_MAP} from '../constants/Game';

const Card =
({ rank, suit, faceup, zindex, direction, onClick, isMouseOver,
  onMouseOver, onMouseLeave, divstyle, imgstyle, cardbackToUse}) => {
  const value = RANK_VALUE_MAP[rank];
  const cardimg = faceup ?
  require('../cardimages/'+value.toString()+suit.toUpperCase()+'.png')
  : require('../storeimages/cardbacks/'+cardbackToUse+'.png');
  const _divstyle = {
    position: 'absolute',
    left: 30*zindex,
    transform: '',
    width: 140,
    height: 200,
    zIndex: zindex,
    border: '1px solid #0000DA',
    transform: (isMouseOver ? 'translate(0,-10px)' : ''),
    ...divstyle
  };
  const _imgstyle = {
    width: 140,
    height: 200,
    ...imgstyle
  };
  return (
    <div style={_divstyle}>
      <img
        style={_imgstyle}
        src={cardimg}
        onClick={() => {
          console.log("Card: " + rank + " of " + suit + " clicked!");
          onClick(rank, suit);
        }}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        alt="blahblahblah"
      />
    </div>
  );

}

export default Card;
