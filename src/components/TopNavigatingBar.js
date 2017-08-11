import React from 'react';
import '../styles/CardStyles.css';

const TopNavigatingBar = ({ divstyle, homebuttonstyle, onHomeClick }) => {
  const homeimg = require('../icons/homebutton.jpg');
  const myaccountimg = require('../icons/myaccountbutton.png');
  const _divstyle = {
    //position: 'absolute',
    position: 'fixed',
    display: "inline-block",
    width: "100%",
    height: "6%",
    border: '1px solid #0000DA',
    ...divstyle
  };
  const _homebuttonstyle = {
    width: 30,
    height: 30,
    ...homebuttonstyle
  };
  const _myaccountbuttonstyle = {
    width: 40,
    height: 40,
    ...homebuttonstyle
  };
  return (
    <div style={_divstyle}>
      <div
        className="clickableHomeButton"
        style={{
          position: 'absolute',
          left: '2%',
          border: '1px solid green',
        }}
      >
        <img
          style={_homebuttonstyle}
          src={homeimg}
          onClick={() => {
            console.log("Home button clicked!");
            onHomeClick();
          }}
          alt="blahblahblah"
        />
        <div>Home</div>
      </div>
      <div
        className="clickableMyAccountButton"
        style={{
          position: 'absolute',
          right: '2%',
          border: '1px solid green',
        }}
      >
        <img
          style={_homebuttonstyle}
          src={myaccountimg}
          onClick={() => {
            console.log("MyAccount button clicked!");
          }}
          alt="blahblahblah"
        />
        <div>My Account</div>
      </div>
      <div
        className="gameTitleBarFont"
        style={{
          //position: 'absolute',
          //left: '50%',
          border: '1px solid green',
        }}
      >
        {"Let\'s Play Bridge"}
      </div>

    </div>
  );
}

export default TopNavigatingBar;
