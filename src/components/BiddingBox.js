import React from 'react';
import Card from './Card';
import {SEATS, SUITS, RANKS, RANK_VALUE_MAP,
  BID_LEVELS, BID_TYPES, BID_SUITS, BID_SUIT_ORDER_MAP, BID_SUIT_UNICODE_MAP
} from '../constants/Game';
import '../styles/CardStyles.css';

const BID_SUIT_LIST = [BID_SUITS.CLUBS, BID_SUITS.DIAMONDS, BID_SUITS.HEARTS,
BID_SUITS.SPADES, BID_SUITS.NOTRUMP];

const compareSuitBids = (bid1, bid2) => {
  if (bid1.level < bid2.level) return -1;
  if (bid1.level > bid2.level) return 1;
  if (BID_SUIT_ORDER_MAP[bid1.suit] < BID_SUIT_ORDER_MAP[bid2.suit]) return -1;
  if (BID_SUIT_ORDER_MAP[bid1.suit] > BID_SUIT_ORDER_MAP[bid2.suit]) return 1;
  return 0;
}

const BiddingBox = ({ lastLevelBid, isDblValid, isRdblValid,
  onBidClick, grayAll, windowHeight, windowWidth }) => {
  let buttonTable = [];
  let sizeExt = '';
  console.log("***************", windowHeight, windowWidth);
  if (windowHeight < 800)
    sizeExt = '2';
  for (let i=1; i<=7; i++) {
    buttonTable.push(
      <tr key={i}>
        {BID_SUIT_LIST.map((elem,idx)=> {
          return (
            <th key={i.toString()+elem}>
              <button
                className={
                  (compareSuitBids(lastLevelBid, {level: i, suit: elem}) < 0 && !grayAll) ?
                  "clickableLevelBidButton"+sizeExt : "invalidUnclickableLevelBidButton"+sizeExt
                }
                onClick={() => {
                  console.log("BiddingBox:",i,elem);
                  onBidClick({type: BID_TYPES.SUIT, level: i, suit: elem});
                }}
              >
                {i.toString()+BID_SUIT_UNICODE_MAP[elem]}
              </button>
            </th>
          )
        })}
      </tr>
    )
  }
  const passButton = (
    <th key={'pass'} colSpan="2">
      <button
        className={
          !grayAll ? "clickablePassBidButton" : "unclickablePassBidButton"
        }
        onClick={() => {
          console.log("BiddingBox: PASS clicked");
          onBidClick({type: BID_TYPES.PASS});
        }}
      >
        Pass
      </button>
    </th>
  );
  const dblButton = (
    <th key={'dbl'}>
      <button
        className={
          (isDblValid && !grayAll) ? "clickableDblButton" : "invalidUnclickableDblButton"
        }
        onClick={() => {
          console.log("BiddingBox: DBL clicked");
          onBidClick({type: BID_TYPES.DBL});
        }}
      >
        X
      </button>
    </th>
  );
  const rdblButton = (
    <th key={'rdbl'}>
      <button
        className={
          (isRdblValid && !grayAll) ? "clickableDblButton" : "invalidUnclickableDblButton"
        }
        onClick={() => {
          console.log("BiddingBox: RDBL clicked");
          onBidClick({type: BID_TYPES.RDBL});
        }}
      >
        XX
      </button>
    </th>
  );
  buttonTable.push(
    <tr key={8}>
      {passButton}
      {dblButton}
      {rdblButton}
    </tr>
  );

  return (
    <div>
      <table style={{
        border: "3px solid black",
      }}>
        <tbody>
          {buttonTable}
        </tbody>
      </table>
    </div>
  );
}
export default BiddingBox;
