import {BID_TYPES, BID_SUITS} from '../constants/Game';

/* UI actions */
export const SCREEN_RESIZE = 'SCREEN_RESIZE';

export const screenResize = (width, height) => ({
  type: SCREEN_RESIZE,
  width,
  height
});

/* Gameplay actions */
export const START_BIDDING = 'START_BIDDING';
export const START_PLAYING = 'START_PLAYING';
export const FINISH_BIDDING = 'FINISH_BIDDING';
export const FINISH_PLAYING = 'FINISH_PLAYING';
export const SET_WHOSE_TURN = 'SET_WHOSE_TURN';
export const PLAY_CARD = 'PLAY_CARD';
export const BOTPLAYCARD_REQUEST = 'BOTPLAYCARD_REQUEST';
export const BOTPLAYCARD_RECEIVE = 'BOTPLAYCARD_RECEIVE';
export const DO_BID = 'DO_BID';
export const BOTBID_REQUEST = 'BOTBID_REQUEST';
export const BOTBID_RECEIVE = 'BOTBID_RECEIVE';
export const NEW_GAME = 'NEW_GAME';
export const FINISHED_TRICK = 'FINISHED_TRICK';
export const CLEAR_BOARD = 'CLEAR_BOARD';
export const INCREMENT_WHOSETURN = 'INCREMENT_WHOSETURN';

export const newGame = (dealer, hands, vulnerability) => ({
  type: NEW_GAME,
  dealer,
  hands,
  vulnerability
});
export const startBidding = () => ({
  type: START_BIDDING,
});
export const finishBidding = (declarer, contract) => ({
  type: FINISH_BIDDING,
  declarer,
  contract,
});
export const setWhoseTurn = (whoseTurn) => ({
  type: SET_WHOSE_TURN,
  whoseTurn
});
export const startPlaying = () => ({
  type: START_PLAYING,
});
export const finishPlaying = (score) => ({
  type: FINISH_PLAYING,
  score,
});
export const doBid = (bid, player) => ({
  type: DO_BID,
  player,
  bid,
});

export const requestBotBid = (player) => ({
  type: BOTBID_REQUEST,
  player
});

export const receiveBotBid = (player, bid) => ({
  type: BOTBID_RECEIVE,
  player,
  bid
});

export const playCard = (card, player) => ({
  type: PLAY_CARD,
  player,
  card,
});

export const finishedTrick = (winner) => ({
  type: FINISHED_TRICK,
  winner
});

export const incrementWhoseTurn = () => ({
  type: INCREMENT_WHOSETURN,
});

export const clearBoard = () => ({
  type: CLEAR_BOARD,
});

export const requestBotPlayCard = (player) => ({
  type: BOTPLAYCARD_REQUEST,
  player
});

export const receiveBotPlayCard = (player, card) => ({
  type: BOTPLAYCARD_RECEIVE,
  player,
  card // not used rn
});

// a friggin THUNK action creator!
export function fetchBotPlayCard (player, url) {
  return function (dispatch)  {
    dispatch(requestBotPlayCard(player));
    let suit;
    let rank;
    return fetch(url).then(
      response => response.text(),
      error => console.log('An error occurred.', error)
    )
    .then(text => {
      console.log(text);
      const retxml = text;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(retxml,"text/xml");
      const rets = xmlDoc.getElementsByTagName("r");
      let cardToPlay = "";
      for (let i=0; i < rets.length; i++) {
        if (rets[i].getAttribute('type') === 'play') {
          cardToPlay = rets[i].getAttribute('card');
          console.log("fetchBotPlayCard dispatch: fetched card to play: " + cardToPlay);
        }
      }
      if (cardToPlay === "") {
        console.log("fetchBotPlayCard dispatch: something went wrong.");
      }
      suit = cardToPlay[0].toLowerCase();
      rank = cardToPlay[1].toUpperCase();
      dispatch(receiveBotPlayCard(player, {suit, rank}));
      return {suit, rank};
    });
  };
}

// anotha flippin THUNK action creator!
export function fetchBotBid (player, url) {
  return function (dispatch)  {
    dispatch(requestBotBid(player));
    let bid;
    return fetch(url).then(
      response => response.text(),
      error => console.log('An error occurred.', error)
    )
    .then(text => {
      console.log(text);
      const retxml = text;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(retxml,"text/xml");
      const rets = xmlDoc.getElementsByTagName("r");
      let rawBid = "";
      for (let i=0; i < rets.length; i++) {
        if (rets[i].getAttribute('type') === 'bid') {
          rawBid = rets[i].getAttribute('bid');
          console.log("fetchBotBid dispatch: fetched bid: " + rawBid);
        }
      }
      if (rawBid === "") {
        console.log("fetchBotBid dispatch: something went wrong.");
        return;
      }
      if (rawBid.toUpperCase() === 'P')
        bid = {type: BID_TYPES.PASS};
      else if (rawBid.toUpperCase() === 'X')
        bid = {type: BID_TYPES.DBL};
      else if (rawBid.toUpperCase() === 'XX')
        bid = {type: BID_TYPES.RDBL};
      else if (rawBid.length === 2) { // normal suit bid
        let bidSuit = '';
        switch (rawBid[1].toUpperCase()) {
          case 'N':
            bidSuit = BID_SUITS.NOTRUMP;
            break;
          case 'S':
            bidSuit = BID_SUITS.SPADES;
            break;
          case 'H':
            bidSuit = BID_SUITS.HEARTS;
            break;
          case 'D':
            bidSuit = BID_SUITS.DIAMONDS;
            break;
          case 'C':
            bidSuit = BID_SUITS.CLUBS;
            break;
          default:
            throw 'not recognized bid suit??';
        }
        bid = {type: BID_TYPES.SUIT, level: parseInt(rawBid[0]), suit: bidSuit}
      }
      else throw 'not recognized bid type??';

      dispatch(receiveBotBid(player, bid));
      return bid;
    });
  };
}
//
