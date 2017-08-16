import React from 'react';
import {BID_SUIT_UNICODE_MAP} from '../constants/Game';

const ScoreContractBox = ({ scoreNS, scoreEW, contract, declarer }) => {
  let strToDisplay = contract.level.toString() + BID_SUIT_UNICODE_MAP[contract.suit];
  strToDisplay = strToDisplay + ' ' + declarer.toUpperCase();
  strToDisplay = strToDisplay + ', ' + 'NS: ' + scoreNS.toString() + ', ' + 'EW: ' + scoreEW.toString();
  return (
    <div
      style={{
        color: '#FFFFFF'
      }}
    >
      <h2>
        {strToDisplay}
      </h2>
    </div>
  );
};


export default ScoreContractBox;
