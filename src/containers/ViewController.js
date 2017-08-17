import React, { Component } from 'react';
import Deck from '../Deck';
import {sortHand} from '../utilfns/HandFns';
import {getAPIrepr_cards} from '../utilfns/APIFns';
import SmartTable from './SmartTable';
import { newGame, finishPlaying, changeView,
  pauseGame, safelyPauseGame, addCoins, subCoins } from '../actions/actions';
import { connect } from 'react-redux';
import {INGAME_VIEW, HOME_SCREEN, STORE_VIEW,
  LOG_IN_VIEW, SIGN_UP_VIEW, VERIFY_VIEW
} from '../constants/Views';
import {SEATS, BID_TYPES} from '../constants/Game';
import {bridgeEngine} from '../BridgeGameEngine';
import BiddingBox from '../components/BiddingBox';
import BiddingDisplay from '../components/BiddingDisplay';
import SmartTopNavigatingBar from '../containers/SmartTopNavigatingBar';
import SmartHomeScreen from './SmartHomeScreen';
import NormalButton from '../components/NormalButton';
import SmartGameStore from '../containers/SmartGameStore';
import SmartLoginPage from '../containers/SmartLoginPage';
import SmartSignupPage from '../containers/SmartSignupPage';
import SmartVerifyPage from '../containers/SmartVerifyPage';
import AccountDropdownMenu from '../components/AccountDropdownMenu';
import Firebase from '../Firebase';

class ViewController extends Component {
  constructor(props) {
    super(props);
    this.onNewGameButtonClick = this.onNewGameButtonClick.bind(this);
    this.sleep = this.sleep.bind(this);
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  onNewGameButtonClick() {
    const d = new Deck();
    d.shuffle();
    const hands=d.generateHands();
    this.props.dispatch(pauseGame());
    this.sleep(500).then(()=> {
      bridgeEngine.reset();
      this.props.dispatch(newGame( 'N', {
        'N': hands[0],
        'S': hands[1],
        'E': hands[2],
        'W': hands[3],
      }, '-'));
    })
  }
  render() {
    const newgamebutton = (
      <NormalButton
        disableTime={1000}
        onButtonClick={this.onNewGameButtonClick}
      >
        New Game
      </NormalButton>
    );
    let view = <div/>;
    switch(this.props.currentView) {
      case INGAME_VIEW:
        const cardTableImg = require('../icons/greenbackground.jpg');
        view = (
          <div
            className={false ? "cardtablescreen" : ''}
            style={{
              //backgroundImage: `url(${cardTableImg})`,
          }}
          >
            <div>
              <SmartTopNavigatingBar
                onHomeClick={()=>{
                  this.props.dispatch(pauseGame());
                  this.sleep(500).then(()=> {
                    this.props.dispatch(changeView(HOME_SCREEN));
                  });
                  // this.props.dispatch(safelyPauseGame(()=>{this.props.dispatch(changeView(HOME_SCREEN));}))
                }}
                onNumCoinsClick={()=>{
                  this.props.dispatch(addCoins(100));
                }}
                numCoins={this.props.coins}
              />
            </div>
            <div
              className="cardtablescreen2"
              style={{
                position: 'fixed',
                top: '5%',
                width: '100%',
                height: '95%',
                backgroundImage: `url(${cardTableImg})`,
              }}
            >
              {newgamebutton}
              <SmartTable
                dealer='N'
              />
            </div>
          </div>);
        break;
      case HOME_SCREEN:
        const img = require('../icons/greenbackground.jpg');
        view = (
          <div>
            <div>
              <SmartTopNavigatingBar
                onHomeClick={()=>{
                  this.props.dispatch(changeView(HOME_SCREEN));
                }}
                numCoins={this.props.coins}
                onNumCoinsClick={()=>{
                  const userDatabasePath = '/users/'+ this.props.userID+'/gamedata';
                  const numCoins = this.props.coins;
                  Firebase.database().ref(userDatabasePath).update({numCoins: numCoins+100 });
                  this.props.dispatch(addCoins(100));
                }}
              />
            </div>
            <div
              className="homescreen"
              style={{
                // backgroundImage: `url(${img})`,
                position: 'absolute',
                height: '5%',
                top: '5%',
                background: '#bfeaea',
              }}
            >
              <SmartHomeScreen/>
            </div>
          </div>
        );
        break;
      case STORE_VIEW:
        view = (
          <div>
            <div style={{
              // position:'absolute',
              // top: 0,
              // left: 0,
              // zIndex: 999,
            }}>
              <SmartTopNavigatingBar
                onHomeClick={()=>{
                  this.props.dispatch(changeView(HOME_SCREEN));
                }}
                numCoins={this.props.coins}
                onNumCoinsClick={()=>{
                  const userDatabasePath = '/users/'+ this.props.userID+'/gamedata';
                  const numCoins = this.props.coins;
                  Firebase.database().ref(userDatabasePath).update({numCoins: numCoins+100 });
                  this.props.dispatch(addCoins(100));
                }}
              />
            </div>
            <div style={{
              position: 'fixed',
              top: '5%',
              width: '100%',
              height: '95%',
              border: '3px solid black',
              padding: 0,
              left: 0,
            }}>
              <SmartGameStore/>
            </div>
          </div>
        );
        break;
      case LOG_IN_VIEW:
        view = (
          <div>
            <SmartLoginPage/>
          </div>
        );
        break;
      case SIGN_UP_VIEW:
        view = (
          <div>
            <SmartSignupPage/>
          </div>
        );
        break;
      case VERIFY_VIEW:
        view = (
          <div>
            <SmartVerifyPage/>
          </div>
        );
        break;
      default:
        break;
    }
    // return (
    //   <SmartVerifyPage/>
    // );
    // return (
    //   <div
    //     style={{
    //       position: 'absolute',
    //       right: '1%',
    //     }}
    //   >
    //     <ImgDropdownMenu>
    //       <img
    //         style={{
    //           width: 48,
    //           height: 40,
    //         }}
    //         src={require('../icons/myaccountbutton.png')}
    //         onClick={() => {
    //           console.log("MyAccount button clicked!");
    //         }}
    //         alt="blahblahblah"
    //       />
    //     </ImgDropdownMenu>
    //   </div>
    // )
    return (
      <div>
        {view}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentView: state.ui.currentView,
    screenHeight: state.ui.screenHeight,
    screenWidth: state.ui.screenWidth,
    coins: state.coins, // should separate this out later
    userID: state.userID,
  }
};

export default connect(mapStateToProps)(ViewController);
