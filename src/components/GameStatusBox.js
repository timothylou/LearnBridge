import React from 'react';

const GameStatusBox = ({ timeElapsed, dealer, vuln, handNumber }) => {

  return (
    <div
      style={{
        color: '#FFFFFF'
      }}
    >
      <p>Dealer: {dealer}</p>
    </div>
  )
};


export default GameStatusBox;
