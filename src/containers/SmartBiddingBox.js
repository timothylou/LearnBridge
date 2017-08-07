import BiddingBox from  '../components/BiddingBox';
import React from 'react';
import {connect} from 'react-redux';
import {bridgeEngine} from '../BridgeGameEngine';
import {SEATS} from '../constants/Game';

class SmartBiddingBox extends React.Component {
  constructor(props) {
    super(props);
    this.onBidClick = this.onBidClick.bind(this);
  }
  onBidClick(bid) {
    if (this.props.isValidBidClick(bid, SEATS.SOUTH))
      this.props.onValidBidClick(bid, SEATS.SOUTH);
    else {
      console.log("SmartBiddingBox::onBidClick: invalid click on bid:", bid);
    }
  }
  render() {

    console.log(this.props.lastSuitBid);
    return (
      <BiddingBox
        lastLevelBid={this.props.lastSuitBid}
        isDblValid={this.props.isDblValid}
        isRdblValid={this.props.isRdblValid}
        onBidClick={this.onBidClick}
      />
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    lastSuitBid: state.biddingBoxHelpers.lastSuitBid,
    isDblValid: state.biddingBoxHelpers.isDblValid,
    isRdblValid: state.biddingBoxHelpers.isRdblValid,
    //isMyTurn: state.whoseTurn === ownProps.seat,
  }
};

export default connect(mapStateToProps)(SmartBiddingBox);
