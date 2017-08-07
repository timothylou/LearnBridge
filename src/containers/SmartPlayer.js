import React from 'react';
import SmartHand from './SmartHand';
import {SEATS, SUITS, RANK_VALUE_MAP, GAMESTATES, PARTNERS
} from '../constants/Game';
import {connect} from 'react-redux';
import Deck from '../Deck';
import {bridgeEngine} from '../BridgeGameEngine';
import { newGame, playCard, fetchBotPlayCard,
  doBid, fetchBotBid,
 } from '../actions/actions';

class SmartPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExecutingPlay: false,
      isExecutingBid: false,
    };
    this.onValidCardClick = this.onValidCardClick.bind(this);
    this.isValidCardClick = this.isValidCardClick.bind(this);
  }

  onValidCardClick(card) {
    console.log('SmartPlayer::onValidCardClick: received validated click');
    this.props.dispatch(playCard(card, this.props.seat));
    this.props.registerValidCardPlay(card, this.props.seat);

  }

  isValidCardClick(card) {
    // return this.props.isValidCardClick(card, this.seatDirection, this.state.cards);
    if (this.props.gameState === GAMESTATES.PLAYING){
      if (this.props.isMyTurn)
        return this.props.isValidCardToPlay(card, this.props.seat);
      else {
        console.log('SmartPlayer::isValidCardToPlay: not your turn,', this.props.seat);
        return false;
      }
    }
    else {
      console.log('SmartPlayer::isValidCardToPlay: not in playing state yet');
      return false;
    }
  }

  componentDidMount() {
    if (this.props.gameState === GAMESTATES.PLAYING) {
      if (((this.props.bot && !this.props.amIDummy) || (this.props.partnerIsBot && this.props.amIDummy))
      && (!this.props.isFetchingPlay && this.props.isMyTurn && !this.state.isExecutingPlay))  {
        console.log('SmartPlayer::componentDidMount: calling doBotPlay');
        this.setState({isExecutingPlay: true});
        this.doBotPlay();
      }
    }
    else if (this.props.gameState === GAMESTATES.BIDDING) {
      if (this.props.bot && !this.props.isFetchingBid &&
        this.props.isMyTurn && !this.state.isExecutingBid)  {
        console.log('SmartPlayer::componentDidMount: calling doBotBid');
        this.setState({isExecutingBid: true});
        this.doBotBid();
      }
    }
  }
  componentDidUpdate(prevProps) {
    console.log('SmartPlayer::componentDidUpdate:' + this.props.seat);
    console.log(this.props.gameState, this.props.bot, this.props.amIDummy,
      this.props.isFetchingPlay, this.props.isMyTurn, this.state.isExecutingPlay);
    if (this.props.gameState === GAMESTATES.PLAYING) {
      if (((this.props.bot && !this.props.amIDummy) || (this.props.partnerIsBot && this.props.amIDummy))
      && (!this.props.isFetchingPlay && this.props.isMyTurn && !this.state.isExecutingPlay))  {
        console.log('SmartPlayer::componentDidUpdate: calling doBotPlay');
        this.setState({isExecutingPlay: true});
        this.doBotPlay();
      }
    }
    else if (this.props.gameState === GAMESTATES.BIDDING) {
      if (this.props.bot && !this.props.isFetchingBid &&
        this.props.isMyTurn && !this.state.isExecutingBid) {
        console.log('SmartPlayer::componentDidUpdate: calling doBotBid');
        this.setState({isExecutingBid: true});
        this.doBotBid();
      }
    }
  }
  doBotPlay() {
    let urlToGetPlay = "http://gibrest.bridgebase.com/u_bm/robot.php?";
    const pov = this.props.amIDummy ? PARTNERS[this.props.seat] : this.props.seat;
    // console.log(this.props.partner);
    urlToGetPlay += "&pov=" + pov;
    // v=vulnerability: ( N for NS, E for EW, B for both, - for none)
    urlToGetPlay += "&v=" + "-";
    // d=dealer
    urlToGetPlay += "&d=" + this.props.dealer;
    // h=bidhistory-playhistory
    urlToGetPlay += "&h=" + this.props.getAPIBidHistory();
    const playhist = this.props.getAPIPlayHistory();
    if (playhist !== "")
      urlToGetPlay += "-" + playhist;
    // o=statehistory (is returned back unchanged for state maintenance)
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
    console.log(urlToGetPlay);

    let cardToPlay;
    this.props.dispatch(
      fetchBotPlayCard(this.props.seat, urlToGetPlay)
    ).then((card) => {
      console.log("finished the fetchbotplaycard dispatch:", card);
      this.props.dispatch(playCard(card, this.props.seat));
      this.props.registerValidCardPlay(card, this.props.seat);
      this.setState({isExecutingPlay: false});
    });
  }
  doBotBid() {
    let urlToGetBid = "http://gibrest.bridgebase.com/u_bm/robot.php?";
    const pov = this.props.seat;
    urlToGetBid += "&pov=" + pov;
    // v=vulnerability: ( N for NS, E for EW, B for both, - for none)
    urlToGetBid += "&v=" + "-";
    // d=dealer
    urlToGetBid += "&d=" + this.props.dealer;
    // h=bidhistory-playhistory
    const bidhist = this.props.getAPIBidHistory();
    urlToGetBid += "&h=" + bidhist;
    // o=statehistory (is returned back unchanged for state maintenance)
    urlToGetBid += "&o=" + "state1";
    const nhand = this.props.APIHandReps[SEATS.NORTH];
    const shand = this.props.APIHandReps[SEATS.SOUTH];
    const ehand = this.props.APIHandReps[SEATS.EAST];
    const whand = this.props.APIHandReps[SEATS.WEST];
    urlToGetBid += "&n=" + nhand;
    urlToGetBid += "&s=" + shand;
    urlToGetBid += "&e=" + ehand;
    urlToGetBid += "&w=" + whand;
    urlToGetBid += "&src=eric";
    console.log(urlToGetBid);

    let bid;
    this.props.dispatch(
      fetchBotBid(this.props.seat, urlToGetBid)
    ).then((bid) => {
      console.log("finished the fetchbotdobid dispatch:", bid);
      bridgeEngine.doBid(bid, this.props.seat);
      this.props.dispatch(doBid(bid, this.props.seat));
      this.props.registerValidBid(bid, this.props.seat);
      this.setState({isExecutingBid: false});
    });
  }

  render() {
    console.log('Player ' + this.props.seat + ' render');
    // need to change offsetfromleft to vary with card size
    return (
      <SmartHand
        trumpSuit='h'
        seat={this.props.seat}
        faceup={this.props.faceup}
        direction='horizontal'
        offsetFromLeft={15*(13-this.props.cardsInHand.length)}
        onValidCardClick={this.onValidCardClick}
        isValidCardClick={
          (this.props.bot && (this.props.partnerIsBot || (!this.props.partnerIsBot && !this.props.amIDummy)))
          ? ((a,b,c)=> {
            console.log('SmartPlayer::isValidCardClick: ignored click on bots hand');
            return false;
          })
          : this.isValidCardClick
        }
      />
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    gameState: state.gameState,
    cardsInHand: state.hands[ownProps.seat],
    hands: state.hands,
    isMyTurn: state.whoseTurn === ownProps.seat,
    isFetchingPlay: state.isFetchingBotPlay.seat === ownProps.seat && state.isFetchingBotPlay.status,
    isFetchingBid: state.isFetchingBotBid.seat === ownProps.seat && state.isFetchingBotBid.status,
    fetchedCard: ownProps.bot ? state.isFetchingBotPlay.card : {},
    fetchedBid: ownProps.bot ? state.isFetchingBotBid.bid : {},
    APIHandReps: state.handsAPIReps,
    amIDummy: (state.gameSettings.declarer === PARTNERS[ownProps.seat]),
    dealer: state.gameSettings.dealer,
    faceup: (
      (ownProps.seat === SEATS.SOUTH)
      ||
      (state.gameState === GAMESTATES.PLAYING &&
        state.gameSettings.declarer === PARTNERS[ownProps.seat] &&
        state.playHistory.length > 0
      )
    ),

  }
};

export default connect(mapStateToProps)(SmartPlayer);
