import React from 'react';
import BridgeHand from './BridgeHand';
import Card from './Card';
import {SEATS, SUITS, RANK_VALUE_MAP} from './constants/Game';


export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.seatDirection = this.props.seatDirection;
    this.isBot = this.props.bot; // boolean
    this.waitingForMove = this.props.isMyTurn;
    this.state = {
      cards: this.sort('h',this.props.rawcardslist),
      numCardsPlayed: 0, // could just calculate this based on length of cards
      loading: false,
    };
    this.onValidCardClick = this.onValidCardClick.bind(this);
    this.isValidCardClick = this.isValidCardClick.bind(this);
  }
  _sortSuitByRank(cardA, cardB) {
    return -(RANK_VALUE_MAP[cardA.rank] - RANK_VALUE_MAP[cardB.rank]);
  }
  removeCard(card) {
    let newcardlist = [];
    for (let i=0; i < this.state.cards.length; i++) {
      if (this.state.cards[i].suit !== card.suit || this.state.cards[i].rank !== card.rank) {
        newcardlist.push(this.state.cards[i]);
      }
    }
    this.setState({ cards: newcardlist } );
  }
  sort(trumpsSuit, cards) {
    let sortedcards = [];
    let clubs = [];
    let diamonds = [];
    let hearts = [];
    let spades = [];

    for (let i=0; i < cards.length; i++) {
      switch(cards[i].suit) {
        case 'c':
          clubs.push(cards[i]);
          break;
        case 'd':
          diamonds.push(cards[i]);
          break;
        case 'h':
          hearts.push(cards[i]);
          break;
        case 's':
          spades.push(cards[i]);
          break;
        default:
          throw 'InvalidSuitError';
      }
    }
    clubs.sort(this._sortSuitByRank);
    diamonds.sort(this._sortSuitByRank);
    hearts.sort(this._sortSuitByRank);
    spades.sort(this._sortSuitByRank);

    if (trumpsSuit==='c') sortedcards = clubs.concat(diamonds,spades,hearts);
    else if (trumpsSuit==='d') sortedcards = diamonds.concat(clubs,hearts,spades);
    else if (trumpsSuit==='h') sortedcards = hearts.concat(spades,diamonds,clubs);
    else if (trumpsSuit==='s') sortedcards = spades.concat(hearts,clubs,diamonds);
    console.log(sortedcards);
    return sortedcards;
  }

  onValidCardClick(card) {
    console.log('Player: received validated click');
    this.props.onValidCardClick(card, this.seatDirection);
    this.removeCard(card);
    this.setState({numCardsPlayed: this.state.numCardsPlayed+1});
  }
  isValidCardClick(card) {
    return this.props.isValidCardClick(card, this.seatDirection, this.state.cards);
  }
  doBotPlay() {
    this.waitingForMove = false;
    this.setState({loading: true});
    let urlToGetPlay = "http://gibrest.bridgebase.com/u_bm/robot.php?";
    const pov = this.props.dummy ? this.props.partner : this.seatDirection;
    console.log(this.props.partner);
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
    console.log(this.props.getAPIHandRep(SEATS.NORTH));
    console.log(this.props.getAPIHandRep(SEATS.SOUTH));
    console.log(this.props.getAPIHandRep(SEATS.EAST));
    console.log(this.props.getAPIHandRep(SEATS.WEST));
    urlToGetPlay += "&n=" + this.props.getAPIHandRep(SEATS.NORTH);
    urlToGetPlay += "&s=" + this.props.getAPIHandRep(SEATS.SOUTH);
    urlToGetPlay += "&e=" + this.props.getAPIHandRep(SEATS.EAST);
    urlToGetPlay += "&w=" + this.props.getAPIHandRep(SEATS.WEST);
    console.log(urlToGetPlay);
    let retxml = "";
    fetch(urlToGetPlay, {
      method: 'GET'
    }).then((resp) => {
      return resp.text();
    }).catch((err) => {
      console.log(err);
    }).then((text) => {
      console.log(text);
      retxml = text;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(retxml,"text/xml");
      const rets = xmlDoc.getElementsByTagName("r");
      // dont forget that on last card, it returns the score too
      let cardToPlay = "";
      for (let i=0; i < rets.length; i++) {
        if (rets[i].getAttribute('type') === 'play') {
          cardToPlay = rets[i].getAttribute('card');
          console.log("Player: fetched card to play: " + cardToPlay);
        }
      }
      if (cardToPlay === "") {
        console.log("Player: something went wrong.");
        return;
      }
      const suit = cardToPlay[0].toLowerCase();
      const rank = cardToPlay[1].toUpperCase();
      this.onValidCardClick({suit: suit, rank: rank});
      this.setState({loading: false});
    }).catch((err) => {
      console.log(err);
    });
  }
  componentDidMount() {
    console.log('in componentdidmount');
    if (this.props.isMyTurn) {
      console.log('componentdidmount is my turn:'  + this.seatDirection);
      this.doBotPlay();

    }
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('in componentdidupdate:' + this.seatDirection);
    console.log(this.props.isMyTurn);
    console.log(this.state.loading);

    if (((this.isBot && !this.props.dummy) || (this.props.partnerIsBot && this.props.dummy))
      && (!this.state.loading && this.props.isMyTurn))  {
      console.log('componentdidupdate is my turn: ' + this.seatDirection);
      this.doBotPlay();
    }
  }
  getAPIrepr_cards() { // maybe can just save results and recalc as appropriate
    let spades = '', hearts = '', diamonds = '', clubs = '';
    for (let i=0; i<this.state.cards.length; i++) {
      switch (this.state.cards[i].suit) {
        case SUITS.SPADES:
          spades += this.state.cards[i].rank;
          break;
        case SUITS.HEARTS:
          hearts += this.state.cards[i].rank;
          break;
        case SUITS.DIAMONDS:
          diamonds += this.state.cards[i].rank;
          break;
        case SUITS.CLUBS:
          clubs += this.state.cards[i].rank;
          break;
        default:
          console.log('dont go here please');
          break;
      }
    }
    return spades + '.' + hearts + '.' + diamonds + '.' + clubs;
  }

  render() {
    console.log('Player ' + this.seatDirection + ' render');
    return (
      <BridgeHand
        rawcardslist={this.state.cards}
        trumpSuit='h'
        seat={this.seatDirection}
        faceup={this.props.faceup}
        direction={'horizontal'}
        offsetFromLeft={15*this.state.numCardsPlayed}
        onValidCardClick={this.onValidCardClick}
        isValidCardClick={this.isBot ? ((a,b,c)=> {
          console.log('Player: ignored click on bots hand');return false;})
          : this.isValidCardClick}
      />
    );
  }
}
