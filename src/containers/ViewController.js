import React, { Component } from 'react';
import Deck from '../Deck';
import {sortHand} from '../utilfns/HandFns';
import {getAPIrepr_cards} from '../utilfns/APIFns';
import SmartTable from './SmartTable';
import { newGame, finishPlaying } from '../actions/actions';
import { connect } from 'react-redux';
import {INGAME_VIEW} from '../constants/Views';
import {SEATS, BID_TYPES} from '../constants/Game';
import {bridgeEngine} from '../BridgeGameEngine';
import BiddingBox from '../components/BiddingBox';
import BiddingDisplay from '../components/BiddingDisplay';

class ViewController extends Component {
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  render() {
    let view = <div/>;
    switch(this.props.currentView) {
      case INGAME_VIEW:
        view = (<SmartTable
          dealer='N'
        />);
        break;
      default:
        break;
    }
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
              'N': sortHand('h',hands[0]),
              'S': sortHand('h',hands[1]),
              'E': sortHand('h',hands[2]),
              'W': sortHand('h',hands[3])
            }, ''));
          })
        }}
      >
        New Game
      </button>
    );
    return (
      <div>
        {newgamebutton}
        {view}
      </div>
    );
    // return (
    //   <BiddingBox/>
    // );
    // return (
    //   <BiddingDisplay
    //     bidHistory={[{bidder: 'E', bid:{type: BID_TYPES.PASS}},
    //     {bidder: 'S', bid:{type: BID_TYPES.SUIT, suit: 's', level: 2}},
    //     {bidder: 'W', bid:{type: BID_TYPES.DBL}}
    //   ]}
    //   />
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
