import React, { Component } from 'react';
import Deck from '../Deck';
import {sortHand} from '../utilfns/HandFns';
import {getAPIrepr_cards} from '../utilfns/APIFns';
import SmartTable from './SmartTable';
import { newGame, finishPlaying, changeView,
  pauseGame, safelyPauseGame, addCoins, subCoins } from '../actions/actions';
import { connect } from 'react-redux';
import {INGAME_VIEW, HOME_SCREEN, STORE_VIEW} from '../constants/Views';
import {SEATS, BID_TYPES} from '../constants/Game';
import {bridgeEngine} from '../BridgeGameEngine';
import BiddingBox from '../components/BiddingBox';
import BiddingDisplay from '../components/BiddingDisplay';
import TopNavigatingBar from '../components/TopNavigatingBar';
import SmartHomeScreen from './SmartHomeScreen';
import NormalButton from '../components/NormalButton';
import CharacterList from '../components/CharacterList';
import CardbackList from '../components/CardbackList';
import StoreItemDetail from '../components/StoreItemDetail';
import SmartGameStore from '../containers/SmartGameStore';

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
            className="cardtablescreen"
            style={{
              backgroundImage: `url(${cardTableImg})`,
          }}
          >
            <div>
              <TopNavigatingBar
                onHomeClick={()=>{
                  this.props.dispatch(pauseGame());
                  this.sleep(500).then(()=> {
                    this.props.dispatch(changeView(HOME_SCREEN));
                  });
                  // this.props.dispatch(safelyPauseGame(()=>{this.props.dispatch(changeView(HOME_SCREEN));}))
                }}
                onNumCoinsClick={()=>{this.props.dispatch(addCoins(100));}}
                numCoins={this.props.coins}
              />
            </div>
            <div style={{
              position: 'fixed',
              top: '6%',
              width: '100%',
              height: '94%'
            }}>
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
          <div
            className="homescreen"
            style={{
              backgroundImage: `url(${img})`,
          }}
          >
            <SmartHomeScreen/>
          </div>
        );
        break;
      case STORE_VIEW:
        view = (
          <div>
            <div style={{
              position:'fixed',
              top: 0,
              left: 0,
            }}>
              <TopNavigatingBar
                onHomeClick={()=>{
                  this.props.dispatch(changeView(HOME_SCREEN));
                }}
                numCoins={this.props.coins}
                onNumCoinsClick={()=>{this.props.dispatch(addCoins(100));}}
              />
            </div>
            <div style={{
              position: 'fixed',
              top: '5%',
              width: '100%',
              height: '94%',
              border: '3px solid black',
              padding: 0,
              left: 0,
            }}>
              <SmartGameStore/>
            </div>
          </div>
        );
        // view = (
        //   <div>
        //     <div style={{
        //       position: 'fixed',
        //       top: 0,
        //       left: 0,
        //     }}>
        //       <TopNavigatingBar
        //         onHomeClick={()=>{
        //           this.props.dispatch(changeView(HOME_SCREEN));
        //         }}
        //       />
        //     </div>
        //     <div style={{
        //       position: 'fixed',
        //       top: '6%',
        //       left: '1%',
        //       width: '30%',
        //       height: '90%',
        //       border: '3px solid teal',
        //     }}>
        //       <StoreItemDetail
        //         itemType='character'
        //         itemID='1'
        //         itemImgExt='png'
        //       />
        //     </div>
        //     <div style={{
        //       position: 'fixed',
        //       top: '6%',
        //       left: '35%',
        //       width: '55%',
        //       height: '90%',
        //       border: '3px solid pink'
        //     }}>
        //       <CharacterList
        //         characters={['alice','bob','alibob','charlie','tim','eric','jonah','eric','asdf','a','a','a','a']}
        //       />
        //       <CardbackList
        //         cardbacks={['Blue','Red','Black','Gold']}
        //       />
        //     </div>
        //   </div>
        // );
        break;
      default:
        break;
    }

    return (
      <div>
        {view}
      </div>
    );


    // return (
    //   <SmartHomeScreen/>
    // );
    // return (
    //   <div>
    //     <div>
    //       <TopNavigatingBar/>
    //     </div>
    //     <div style={{
    //       position: 'fixed',
    //       top: '6%',
    //       width: '100%',
    //       height: '94%'
    //     }}>
    //       {newgamebutton}
    //       {view}
    //     </div>
    //   </div>
    // );

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentView: state.ui.currentView,
    screenHeight: state.ui.screenHeight,
    screenWidth: state.ui.screenWidth,
    coins: state.coins, // should separate this out later
  }
};

export default connect(mapStateToProps)(ViewController);
