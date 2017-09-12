import React from 'react';
import {connect} from 'react-redux';
import Deck from '../Deck';
import SmartPlayer from './SmartPlayer';
import CardsOnTable from '../components/CardsOnTable';
import SmartBiddingBox from './SmartBiddingBox';
import BiddingDisplay from '../components/BiddingDisplay';
import {bridgeEngine} from '../BridgeGameEngine';
import {SUITS, RANKS, RANK_VALUE_MAP, SEATS, GAMESTATES} from '../constants/Game';
import { newGame, playCard, finishedTrick, setWhoseTurn,
  clearBoard, incrementWhoseTurn, doBid,
  screenResize, startBidding, finishBidding, startPlaying, finishPlaying,
  fetchResults, startedTurn, completedTurn,
} from '../actions/actions';
import {sortHand} from '../utilfns/HandFns';
import {getAPIrepr_cards, getAPIrepr_playhistory, getAPIrepr_bidhistory
} from '../utilfns/APIFns';
import ScoreContractBox from '../components/ScoreContractBox';
import GameStatusBox from '../components/GameStatusBox';
import ResultsDisplay from '../components/ResultsDisplay';

class SmartTable extends React.Component {
  constructor(props) {
    super(props);
    console.log('SmartTable constructor called!');
    this.state = {
      wwidth: '0', wheight: '0',
      allPassFlag: false,
    };

    const d = new Deck();
    d.shuffle();
    const hands=d.generateHands();
    bridgeEngine.reset();
    this.props.dispatch(newGame( 'N', {
      'N': hands[0],
      'S': hands[1],
      'E': hands[2],
      'W': hands[3]
    }, '-'));
    this.props.dispatch(startBidding());

    bridgeEngine.setDealer(this.props.dealer);

    this.getAPIrepr_playhistory = this.getAPIrepr_playhistory.bind(this);
    this.getAPIrepr_bidhistory = this.getAPIrepr_bidhistory.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.registerValidCardPlay = this.registerValidCardPlay.bind(this);
    this.registerValidBid = this.registerValidBid.bind(this);
    this.isValidCardToPlay = this.isValidCardToPlay.bind(this);
    this.isValidBid = this.isValidBid.bind(this);
    this.isValidBidClick = this.isValidBidClick.bind(this);
    this.onValidBidClick = this.onValidBidClick.bind(this);
  }

  getAPIrepr_playhistory() {
    return getAPIrepr_playhistory(this.props.playHistory);
  }
  getAPIrepr_bidhistory() {
    return getAPIrepr_bidhistory(this.props.bidHistory);
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  getresultsurl() {
    let urlToGetPlay = "http://gibrest.bridgebase.com/u_bm/robot.php?";
    const pov = SEATS.NORTH; // doesnt matter who
    urlToGetPlay += "&pov=" + pov;
    urlToGetPlay += "&v=" + "-";
    urlToGetPlay += "&d=" + this.props.dealer;
    urlToGetPlay += "&h=" + this.getAPIrepr_bidhistory() + "-" + this.getAPIrepr_playhistory();
    urlToGetPlay += "&o=" + "state1";
    const nhand = this.props.APIHandReps[SEATS.NORTH];
    const shand = this.props.APIHandReps[SEATS.SOUTH];
    const ehand = this.props.APIHandReps[SEATS.EAST];
    const whand = this.props.APIHandReps[SEATS.WEST];
    urlToGetPlay += "&n=" + nhand;
    urlToGetPlay += "&s=" + shand;
    urlToGetPlay += "&e=" + ehand;
    urlToGetPlay += "&w=" + whand;
    urlToGetPlay += "&src=eric";
    return urlToGetPlay;
  }
  registerValidCardPlay(card, seat) {
    console.log('SmartTable::registerValidCardPlay: received validated card to play from', seat);
    bridgeEngine.playCard(card, seat);

    if (bridgeEngine.isTrickOver()) {
      const winner = bridgeEngine.getRoundWinner();
      bridgeEngine.clearTrick();
      const beforeFinishedTrickNumTricks = this.props.tricksEW + this.props.tricksNS;
      this.props.dispatch(finishedTrick(winner));
      console.log('SmartTable::registerValidCardPlay: winner of round was: ' + winner);
      if (beforeFinishedTrickNumTricks + 1 === 13) {
        console.log('game over');
        this.props.dispatch(finishPlaying());
        this.sleep(10).then(()=> {
          this.props.dispatch(fetchResults(this.getresultsurl()));
          this.props.dispatch(completedTurn(seat));
        });

      }
      else {
        this.props.dispatch(setWhoseTurn(winner));
        this.props.dispatch(completedTurn(seat));
      }
    }
    else {
      this.props.dispatch(incrementWhoseTurn());
      this.props.dispatch(completedTurn(seat));
    }
  }
  registerValidBid(bid, seat) {
    console.log('SmartTable::registerValidBid: received validated bid from', seat);
    if (this.state.allPassFlag) { // reset from previous rounds if necessary
      this.setState({allPassFlag: false});
    }
    if (bridgeEngine.isBiddingComplete()) {
      const contract = bridgeEngine.getContract();
      if (contract.suit === 'pass') {
        this.props.dispatch(finishPlaying());
        this.setState({ allPassFlag: true });
        return;
      }
      bridgeEngine.setTrumpSuit(contract.suit);
      this.props.dispatch(finishBidding(contract.declarer, {
        suit: contract.suit,
        level: contract.level
      }));
      this.props.dispatch(startPlaying());
      this.props.dispatch(completedTurn(seat));
      console.log('SmartTable::registerValidBid: final bidding contract:', contract);
    }
    else {
      this.props.dispatch(incrementWhoseTurn());
      this.props.dispatch(completedTurn(seat));
    }
  }
  isValidCardToPlay(card, seat) {
    const isValid = bridgeEngine.isValidCard(card, this.props.hands[seat]);
    if (isValid) console.log('SmartTable::isValidCardToPlay: VALID');
    else console.log('SmartTable::isValidCardToPlay: INVALID');
    return isValid;
  }
  isValidBid(bid, seat) {
    const isValid = bridgeEngine.isValidBid(bid, seat);
    if (isValid) console.log('SmartTable::isValidBid: VALID');
    else console.log('SmartTable::isValidBid: INVALID');
    return isValid;
  }
  isValidBidClick(bid, seat) {
    if (this.props.whoseTurn === seat) {
      console.log("SmartTable::isValidBidClick: it is my turn");
      return this.isValidBid(bid, seat);
    }
    else {
      console.log("SmartTable::isValidBidClick: it is not my turn", seat, this.props.whoseTurn);
      return false;
    }
  }
  onValidBidClick(bid, seat) {
    bridgeEngine.doBid(bid, seat);
    this.props.dispatch(doBid(bid, seat));
    this.registerValidBid(bid, seat);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize',this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    // this.setState({wwidth: window.innerWidth, wheight: window.innerHeight });
    this.props.dispatch(screenResize(window.innerWidth, window.innerHeight));
    //console.log('win width: ' + this.state.wwidth.toString());
    //console.log('win height: ' + this.state.wheight.toString());
  }
  render() {
    console.log('SmartTable render');
    const cardHeight = (this.props.screenHeight - this.props.screenHeight%50)/5;
    const cardWidth = cardHeight*7/10;
    return (
      <div style={{minWidth:"1000px"}}>
        <div style={{
          position: 'absolute',
          top: '1%',
          left: '50%',
          marginLeft: -(cardWidth+cardWidth/5*12)/2,
          height: cardHeight+10,
          width: (cardWidth+cardWidth/5*12)+6,
          // border: '3px solid #FF0000',
        }}>
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.NORTH}
            bot={true}
            partnerIsBot={false}
            direction={'horizontal'}
            registerValidCardPlay={this.registerValidCardPlay}
            registerValidBid={this.registerValidBid}
            isValidCardToPlay={this.isValidCardToPlay}
            isValidBid={this.isValidBid}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
            getAPIBidHistory={this.getAPIrepr_bidhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '1%',
          left: '50%',
          height: cardHeight+10,
          width: (cardWidth+cardWidth/5*12)+6,
          marginLeft: -(cardWidth+cardWidth/5*12)/2,
          // border: '3px solid #FF0000',
        }}>
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.SOUTH}
            bot={false}
            partnerIsBot={true}
            direction={'horizontal'}
            registerValidCardPlay={this.registerValidCardPlay}
            registerValidBid={this.registerValidBid}
            isValidCardToPlay={this.isValidCardToPlay}
            isValidBid={this.isValidBid}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
            getAPIBidHistory={this.getAPIrepr_bidhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '1%',
          height: cardHeight+10,
          width: (cardWidth+cardWidth/5*12)+6,
          marginTop: -(cardHeight)/2,
          // border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.EAST}
            bot={true}
            partnerIsBot={true}
            direction={'vertical'}
            registerValidCardPlay={this.registerValidCardPlay}
            registerValidBid={this.registerValidBid}
            isValidCardToPlay={this.isValidCardToPlay}
            isValidBid={this.isValidBid}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
            getAPIBidHistory={this.getAPIrepr_bidhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '1%',
          height: cardHeight+10,
          width: (cardWidth+cardWidth/5*12)+6,
          marginTop: -(cardHeight)/2,
          // border: '3px solid #FF0000',
          transform: 'rotate(0deg)',
        }}>
          <SmartPlayer
            trumpSuit='h'
            seat={SEATS.WEST}
            bot={true}
            partnerIsBot={true}
            direction={'vertical'}
            registerValidCardPlay={this.registerValidCardPlay}
            registerValidBid={this.registerValidBid}
            isValidCardToPlay={this.isValidCardToPlay}
            isValidBid={this.isValidBid}
            getAPIPlayHistory={this.getAPIrepr_playhistory}
            getAPIBidHistory={this.getAPIrepr_bidhistory}
          />
        </div>
        <div style={{
          position: 'absolute',
          left: '40%',
          top: '35%',
          height: '30%',
          width: '20%',
          // border: '3px solid #FF0000',
          fontFamily: 'Arial',
        }}>
          {(this.props.gameState === GAMESTATES.PLAYING) && <CardsOnTable
            cardlist={this.props.cardsOnTable}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
          />}
          {(this.props.gameState === GAMESTATES.BIDDING) &&
            <BiddingDisplay
              bidHistory={this.props.bidHistory}
            />}
          {(this.props.gameState === GAMESTATES.RESULTS) &&
            <ResultsDisplay
              allPass={this.state.allPassFlag}
              score={this.props.score}
              stillfetching={this.props.isFetchingScore}
            />}
        </div>

        <div style={{
          position: 'absolute',
          right: "1%",
          bottom: "1%",
        }}>
          {(this.props.gameState === GAMESTATES.BIDDING) &&
            <SmartBiddingBox
              onValidBidClick={this.onValidBidClick}
              isValidBidClick={this.isValidBidClick}
              isMyTurn={this.props.whoseTurn === SEATS.SOUTH}
            />}
        </div>
        <div style={{
          position: 'absolute',
          right: "1%",
          bottom: "1%",
          border: '3px solid orange',
        }}>
          {this.props.gameState === GAMESTATES.PLAYING &&
            <ScoreContractBox
              scoreNS={this.props.tricksNS}
              scoreEW={this.props.tricksEW}
              contract={this.props.contract}
              declarer={this.props.declarer}
            />}
        </div>
        <div style={{
          position: 'absolute',
          right: "1%",
          top : "1%",
          // border: '3px solid green',
        }}>
          <GameStatusBox
            dealer={this.props.dealer}
          />
          {(this.props.gameState === GAMESTATES.PLAYING) &&
            <BiddingDisplay
              bidHistory={this.props.bidHistory}
            />}
        </div>
      </div>

    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    hands: state.hands,
    APIHandReps: state.handsAPIReps,
    playHistory: state.playHistory,
    bidHistory: state.bidHistory,
    cardsOnTable: state.cardsOnTable,
    screenHeight: state.ui.screenHeight,
    screenWidth: state.ui.screenWidth,
    gameState: state.gameState,
    whoseTurn: state.whoseTurn,
    dealer: state.gameSettings.dealer,
    vulnerability: state.gameSettings.vulnerability,
    declarer: state.gameSettings.declarer,
    contract: state.gameSettings.contract,
    tricksNS: state.tricksTaken.NS,
    tricksEW: state.tricksTaken.EW,
    score: state.isFetchingResults.score,
    isFetchingScore: state.isFetchingResults.status,
  }
};

export default connect(mapStateToProps)(SmartTable);
