import React from 'react';
import SmartHand from './SmartHand';
import {SEATS, SUITS, RANK_VALUE_MAP} from '../constants/Game';
import {connect} from 'react-redux';
import Deck from '../Deck';
import {bridgeEngine} from '../BridgeGameEngine';
import { newGame, playCard, fetchBotPlayCard } from '../actions/actions';

class SmartPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExecutingPlay: false,
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
    if (this.props.isMyTurn && !this.props.dummy)
      return this.props.isValidCardToPlay(card, this.props.seat);
    else {
      console.log('SmartPlayer::isValidCardToPlay: not your turn,', this.props.seat);
      return false;
    }
  }

  componentDidMount() {
    if (((this.props.bot && !this.props.dummy) || (this.props.partnerIsBot && this.props.dummy))
    && (!this.props.isFetching && this.props.isMyTurn && !this.state.isExecutingPlay))  {
      console.log('SmartPlayer::componentDidMount: calling doBotPlay');
      this.setState({isExecutingPlay: true});
      this.doBotPlay();
    }
  }
  componentDidUpdate(prevProps) {
    console.log('SmartPlayer::componentDidUpdate:' + this.props.seat);
    console.log(this.state.isExecutingPlay);
    // if (!prevProps.isMyTurn && this.props.isMyTurn) {
      if (((this.props.bot && !this.props.dummy) || (this.props.partnerIsBot && this.props.dummy))
      && (!this.props.isFetching && this.props.isMyTurn && !this.state.isExecutingPlay))  {
        console.log('SmartPlayer::componentDidUpdate: calling doBotPlay');
        this.setState({isExecutingPlay: true});
        this.doBotPlay();
      }
    // }
  }
  doBotPlay() {
    let urlToGetPlay = "http://gibrest.bridgebase.com/u_bm/robot.php?";
    const pov = this.props.dummy ? this.props.partner : this.props.seat;
    // console.log(this.props.partner);
    urlToGetPlay += "&pov=" + pov;
    // v=vulnerability: ( N for NS, E for EW, B for both, - for none)
    urlToGetPlay += "&v=" + "-";
    // d=dealer
    urlToGetPlay += "&d=" + "W";
    // h=bidhistory
    urlToGetPlay += "&h=" + "1h-p-p-p";
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

  render() {
    console.log('Player ' + this.props.seat + ' render');
    return (
      <SmartHand
        trumpSuit='h'
        seat={this.props.seat}
        faceup={this.props.faceup}
        direction='horizontal'
        offsetFromLeft={15*(13-this.props.cardsInHand.length)}
        onValidCardClick={this.onValidCardClick}
        isValidCardClick={this.props.bot ? ((a,b,c)=> {
          console.log('SmartPlayer::isValidCardClick: ignored click on bots hand');return false;})
          : this.isValidCardClick}
      />
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    cardsInHand: state.hands[ownProps.seat],
    hands: state.hands,
    isMyTurn: state.whoseTurn === ownProps.seat,
    isFetching: state.isFetchingBotPlay.seat === ownProps.seat && state.isFetchingBotPlay.status,
    fetchedCard: ownProps.bot ? state.isFetchingBotPlay.card : {},
  }
};

export default connect(mapStateToProps)(SmartPlayer);
