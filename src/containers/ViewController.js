import React, { Component } from 'react';
import Deck from '../Deck';
import {sortHand} from '../utilfns/HandFns';
import {getAPIrepr_cards} from '../utilfns/APIFns';
import SmartTable from './SmartTable';
import { newGame, finishPlaying, changeView } from '../actions/actions';
import { connect } from 'react-redux';
import {INGAME_VIEW, HOME_SCREEN} from '../constants/Views';
import {SEATS, BID_TYPES} from '../constants/Game';
import {bridgeEngine} from '../BridgeGameEngine';
import BiddingBox from '../components/BiddingBox';
import BiddingDisplay from '../components/BiddingDisplay';
import TopNavigatingBar from '../components/TopNavigatingBar';
import SmartHomeScreen from './SmartHomeScreen';


class ViewController extends Component {
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  render() {
    const newgamebutton = (
      <button
        type="button"
        onClick={()=>{
          const d = new Deck();
          d.shuffle();
          const hands=d.generateHands();
          this.props.dispatch(finishPlaying());
          this.sleep(500).then(()=> {
            bridgeEngine.reset();
            this.props.dispatch(newGame( 'N', {
              'N': hands[0],
              'S': hands[1],
              'E': hands[2],
              'W': hands[3],
            }, ''));
          })
        }}
      >
        New Game
      </button>
    );
    let view = <div/>;
    switch(this.props.currentView) {
      case INGAME_VIEW:
        view = (<div>
            <div>
              <TopNavigatingBar
                onHomeClick={()=>{this.props.dispatch(changeView(HOME_SCREEN));}}
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
  }
};

export default connect(mapStateToProps)(ViewController);
