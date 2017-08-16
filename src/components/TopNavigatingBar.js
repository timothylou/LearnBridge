import React from 'react';
import NormalButton from './NormalButton';
import DivButton from './DivButton';
import '../styles/CardStyles.css';

const TopNavigatingBar = ({
  divstyle, homebuttonstyle, onHomeClick, numCoins, onNumCoinsClick,
 }) => {
  const homeimg = require('../icons/homebutton.png');
  const myaccountimg = require('../icons/myaccountbutton.png');
  const _divstyle = {
    //position: 'absolute',
    position: 'fixed',
    display: "inline-block",
    width: "100%",
    overflow: 'hidden',
    border: '1px solid #0000DA',
    backgroundColor: '#ffe4c4',
    ...divstyle
  };
  const _homebuttonstyle = {
    width: 40,
    height: 40,
    ...homebuttonstyle
  };
  const _myaccountbuttonstyle = {
    width: 48,
    height: 40,
    ...homebuttonstyle
  };
  return (
    <div style={_divstyle}>
      <DivButton
        className="clickableHomeButton"
        disableTime={1000}
        buttonStyle={{
          float: 'left',
          marginLeft: '10px',
          border: '1px solid green',
        }}
        onButtonClick={() => {
          console.log("Home button clicked!");
          onHomeClick();
        }}

      >
        <img
          style={_homebuttonstyle}
          src={homeimg}

          alt="blahblahblah"
        />
      </DivButton>
      <div
        className="clickableMyAccountButton"
        style={{
          float: 'right',
          marginRight: '10px',
          border: '1px solid green',
        }}
      >
        <img
          style={_myaccountbuttonstyle}
          src={myaccountimg}
          onClick={() => {
            console.log("MyAccount button clicked!");
          }}
          alt="blahblahblah"
        />
      </div>
      <div
        className="gameTitleBarFont"
        style={{
          //position: 'absolute',
          //left: '50%',
          //border: '1px solid green',
        }}
      >
        {"Bridge Buddies"}
      </div>
      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: 0,
        }}
        onClick={onNumCoinsClick}
      >
        {'Coins: ' + numCoins.toString()}
      </div>
    </div>
  );
}

export default TopNavigatingBar;
