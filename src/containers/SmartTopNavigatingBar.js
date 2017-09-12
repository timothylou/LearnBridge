import React from 'react';
import NormalButton from '../components/NormalButton';
import DivButton from '../components/DivButton';
import '../styles/CardStyles.css';
import AccountDropdownMenu from '../components/AccountDropdownMenu';
import {connect } from 'react-redux';
import {changeView} from '../actions/actions';
import {LOG_IN_VIEW} from '../constants/Views';
import Firebase from '../Firebase';

class SmartTopNavigatingBar extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    const homeimg = require('../icons/homebutton.png');
    const myaccountimg = require('../icons/myaccountbutton.png');
    const _divstyle = {
    //position: 'absolute',
      position: 'absolute',
      display: "inline-block",
      width: "100%",
      height: '5%',
      overflow: 'visible',
      border: '1px solid #0000DA',
      backgroundColor: '#ffe4c4',
      ...this.props.divstyle
    };
    const _homebuttonstyle = this.props.windowHeight < 800 ?
    {
      width: 30,
      height: 30,
      ...this.props.homebuttonstyle
    }:
    {
      width: 40,
      height: 40,
      ...this.props.homebuttonstyle
    };
    const _myaccountbuttonstyle = this.props.windowHeight < 800 ?
    {
      width: 36,
      height: 30,
      ...this.props.homebuttonstyle
    }:
    {
      width: 48,
      height: 40,
      ...this.props.homebuttonstyle
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
            this.props.onHomeClick();
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
          <AccountDropdownMenu
            onLogoutClick={()=>{
              Firebase.auth().signOut().then(()=> {
                this.props.dispatch(changeView(LOG_IN_VIEW));
              }).catch((error) => {
                console.log("Could not sign user out:", error.message);
              });
            }}
            onSettingsClick={()=>{console.log('clicked settings');}}
          >
            <img
              style={_myaccountbuttonstyle}
              src={myaccountimg}
              onClick={() => {
                console.log("MyAccount button clicked!");
              }}
              alt="blahblahblah"
            />
          </AccountDropdownMenu>
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
          onClick={this.props.onNumCoinsClick}
        >
          {'Coins: ' + this.props.numCoins.toString()}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    currentView: state.ui.currentView,
    windowHeight: state.ui.screenHeight,
    windowWidth: state.ui.screenWidth,
  }
};
export default connect(mapStateToProps)(SmartTopNavigatingBar);
