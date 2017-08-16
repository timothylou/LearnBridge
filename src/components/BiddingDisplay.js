import React from 'react';
import {SEATS, BID_TYPES, BID_SUIT_UNICODE_MAP} from '../constants/Game';

const bidToString = (bid) => {
  switch (bid.type) {
    case BID_TYPES.PASS:
      return "P";
    case BID_TYPES.DBL:
      return "X";
    case BID_TYPES.RDBL:
      return "XX";
    case BID_TYPES.SUIT:
      return bid.level.toString()+BID_SUIT_UNICODE_MAP[bid.suit];
    default:
      return "lol";
  }
}

const BiddingDisplay = ({bidHistory}) => {
  let tableRowsList = [];
  let offset = 0;
  let currentRow = [];
  console.log(bidHistory);
  if (bidHistory.length >= 1) {
    if (bidHistory[0].bidder === SEATS.NORTH) ;
    else if (bidHistory[0].bidder === SEATS.EAST) currentRow.push(<th key={'nf'}/>);
    else if (bidHistory[0].bidder === SEATS.SOUTH) {
      currentRow.push(<th key={'nf'}/>);
      currentRow.push(<th key={'ef'}/>);
    }
    else if (bidHistory[0].bidder === SEATS.WEST) {
      currentRow.push(<th key={'nf'}/>);
      currentRow.push(<th key={'ef'}/>);
      currentRow.push(<th key={'sf'}/>);
    }
  }
  for (let i=0; i<bidHistory.length; i++) {
    const bidstr = bidToString(bidHistory[i].bid);
    switch (bidHistory[i].bidder) {
      case SEATS.WEST:
        currentRow.push(<th key={bidHistory[i].bidder+bidstr}>{bidstr}</th>);
        tableRowsList.push(<tr key={i}>{currentRow}</tr>);
        currentRow = [];
        break;
      case SEATS.NORTH:
      case SEATS.EAST:
      case SEATS.SOUTH:
        currentRow.push(<th key={bidHistory[i].bidder+bidstr}>{bidstr}</th>)
        break;
      default:
        break;
    }
  }
  if (currentRow.length > 0)
    tableRowsList.push(<tr key={'last'}>{currentRow}</tr>);
  console.log(tableRowsList);

  return (
    <table style={{
      border: "3px solid pink",
      width: '100%',
      color: 'white',
    }}>
      <tbody>
        <tr>
          <th>North</th>
          <th>East</th>
          <th>South</th>
          <th>West</th>
        </tr>
        {tableRowsList}
      </tbody>
    </table>
  )

}

export default BiddingDisplay;
