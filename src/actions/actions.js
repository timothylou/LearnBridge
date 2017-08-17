import {BID_TYPES, BID_SUITS} from '../constants/Game';
import {
  INGAME_VIEW, HOME_SCREEN,
} from '../constants/Views';
import Firebase from '../Firebase';

/* UI actions */
export const SCREEN_RESIZE = 'SCREEN_RESIZE';
export const CHANGE_VIEW = 'CHANGE_VIEW';

export const screenResize = (width, height) => ({
  type: SCREEN_RESIZE,
  width,
  height
});
export const changeView = (nextView) => ({
  type: CHANGE_VIEW,
  nextView,
});

/* User state actions */
export const LOG_IN = 'LOG_IN';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';

export const logIn = (userID) => ({
  type: LOG_IN,
  userID,
});
export const setUserDetails = (userID, coins, purchasedItems, stats, activeItems)=> ({
  type: SET_USER_DETAILS,
  userID,
  coins,
  purchasedItems,
  stats,
  activeItems,
});

export function loadAndSetUserDetails(userID) {
  return function (dispatch, getState) {
    const userDatabasePath = '/users/' + userID + '/gamedata';
    return Firebase.database().ref(userDatabasePath).once('value').then((snapshot)=>{
      const numCoins = snapshot.val().numCoins;
      const exp = snapshot.val().exp;
      const level = snapshot.val().level;
      let activeCardback = snapshot.val().activeCardback;
      let activeCharacter = snapshot.val().activeCharacter;
      let cardbacks = snapshot.val().cardbacks;
      let characters = snapshot.val().characters;
      if (typeof cardbacks == 'undefined' || cardbacks === 0)
        cardbacks = [];
      else
        cardbacks = Object.keys(cardbacks);
      if (typeof characters == 'undefined' || characters === 0)
        characters = [];
      else
        characters = Object.keys(characters);
      console.log('*',numCoins, '*', exp,'*',level,'*', cardbacks, '*',characters,'*');
      dispatch(setUserDetails(userID, numCoins, {
        characters: characters,
        cardbacks: cardbacks,
      }, {
        level: level,
        exp: exp,
      }, {
        activeCardbackID: activeCardback,
        activeCharacterID: activeCharacter,
      }));
    }).catch((error) => {
      console.log("Fetch from Firebase DB failed:", error.message);
    })
  }
}

//
//     dispatch(requestResults());
//     let result;
//     console.log(url);
//     return fetch(url).then(
//       response => response.text(),
//       error => console.log('An error occurred.', error)
//     )
//     .then(text => {
//       console.log(text);
//       const retxml = text;
//       const parser = new DOMParser();
//       const xmlDoc = parser.parseFromString(retxml,"text/xml");
//       const rets = xmlDoc.getElementsByTagName("r");
//       let rawResults = "";
//       for (let i=0; i < rets.length; i++) {
//         if (rets[i].getAttribute('type') === 'result') {
//           rawResults = rets[i].getAttribute('result');
//           console.log("fetchResults dispatch: fetched result: " + rawResults);
//         }
//       }
//       if (rawResults === "") {
//         console.log("fetchResults dispatch: something went wrong.");
//         return;
//       }
//       if (rawResults.substring(0,3) === 'N/S')
//         result = parseInt(rawResults.substring(4,rawResults.length));
//       else if (rawResults.substring(0,3) === 'E/W')
//         result = -1*parseInt(rawResults.substring(4,rawResults.length));
//       else throw 'not recognized result??';
//       dispatch(receiveResults(result));
//       return result;
//     });
//   }
// }

/* Game store actions */
export const ADD_COINS = 'ADD_COINS';
export const SUB_COINS = 'SUB_COINS';
export const PURCHASED_ITEM = 'PURCHASED_ITEM';
export const CHANGE_ACTIVE_CARDBACK = 'CHANGE_ACTIVE_CARDBACK';
export const CHANGE_ACTIVE_CHARACTER = 'CHANGE_ACTIVE_CHARACTER';

export const addCoins = (qty) => ({
  type: ADD_COINS,
  qty,
});

export const subCoins = (qty) => ({
  type: SUB_COINS,
  qty,
});

export const purchasedItem = (itemType, itemID) => ({
  type: PURCHASED_ITEM,
  itemType,
  itemID,
});
export const changeActiveCardback = (cardback) => ({
  type: CHANGE_ACTIVE_CARDBACK,
  cardback,
});
export const changeActiveCharacter = (character) => ({
  type: CHANGE_ACTIVE_CHARACTER,
  character,
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
export const RESULTS_REQUEST = 'RESULTS_REQUEST';
export const RESULTS_RECEIVE = 'RESULTS_RECEIVE';
export const NEW_GAME = 'NEW_GAME';
export const FINISHED_TRICK = 'FINISHED_TRICK';
export const CLEAR_BOARD = 'CLEAR_BOARD';
export const INCREMENT_WHOSETURN = 'INCREMENT_WHOSETURN';
export const TURN_START    = 'TURN_START';
export const TURN_COMPLETE = 'TURN_COMPLETE'; // signifies that current player is completely done with turn
export const PAUSE_GAME = 'PAUSE_GAME';


export const newGame = (dealer, hands, vulnerability) => ({
  type: NEW_GAME,
  dealer,
  hands,
  vulnerability
});
export const pauseGame = () => ({
  type: PAUSE_GAME,
});
export const startedTurn = (player) => ({
  type: TURN_START,
  player
});
export const completedTurn = (player) => ({
  type: TURN_COMPLETE,
  player
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
export const requestResults = () => ({
  type: RESULTS_REQUEST,
});
export const receiveResults = (score) => ({
  type: RESULTS_RECEIVE,
  score,
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

// a third frackin THUNK action creator!
export function fetchResults(url) { // returns resulting score from NS perspective
  return function (dispatch)  {
    dispatch(requestResults());
    let result;
    console.log(url);
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
      let rawResults = "";
      for (let i=0; i < rets.length; i++) {
        if (rets[i].getAttribute('type') === 'result') {
          rawResults = rets[i].getAttribute('result');
          console.log("fetchResults dispatch: fetched result: " + rawResults);
        }
      }
      if (rawResults === "") {
        console.log("fetchResults dispatch: something went wrong.");
        return;
      }
      if (rawResults.substring(0,3) === 'N/S')
        result = parseInt(rawResults.substring(4,rawResults.length));
      else if (rawResults.substring(0,3) === 'E/W')
        result = -1*parseInt(rawResults.substring(4,rawResults.length));
      else throw 'not recognized result??';
      dispatch(receiveResults(result));
      return result;
    });
  }
}

export function safelyPauseGame(nextfn) {
  return function (dispatch, getState)  {
    console.log(!getState().turnCompletionStatus.status);
    if (!getState().turnCompletionStatus.status) {
      window.setTimeout(dispatch(safelyPauseGame()), 1000);
    }
    else {
      dispatch(pauseGame());
      nextfn();
    }
  }
}
