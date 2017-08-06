import {combineReducers} from 'redux';
import {
  PLAY_CARD,
  BOTPLAYCARD_RECEIVE,
  BOTPLAYCARD_REQUEST,
  NEW_GAME,
  FINISHED_TRICK,
  INCREMENT_WHOSETURN,
  SCREEN_RESIZE,
  START_PLAYING,
  FINISH_PLAYING,
  START_BIDDING,
  FINISH_BIDDING,
  DO_BID,
  BOTBID_RECEIVE,
  BOTBID_REQUEST,
} from '../actions/actions';
import {
  getAPIrepr_cards
} from '../utilfns/APIFns';
import {
  INGAME_VIEW
} from '../constants/Views';
import {SEATS, GAMESTATES} from '../constants/Game';

function nextPlayer(seat) {
  switch (seat) {
    case SEATS.NORTH:
      return SEATS.EAST;
    case SEATS.EAST:
      return SEATS.SOUTH;
    case SEATS.SOUTH:
      return SEATS.WEST;
    case SEATS.WEST:
      return SEATS.NORTH;
    default:
      return "not good";
  }
}

function removeCard(cardlist, card) {
  return (cardlist.filter((c)=>{
    return (c.suit !== card.suit || c.rank !== card.rank);
  }));
}

function whoseTurn(state='',action) {
  switch (action.type) {
    case NEW_GAME:
      return action.dealer;
    case INCREMENT_WHOSETURN:
      return nextPlayer(state);
    case FINISHED_TRICK:
      return action.winner;
    default:
      return state;
  }
}
function playHistory(state=[],action) {
  switch (action.type) {
    case PLAY_CARD:
      return [
        ...state,
        action.card
      ];
    case NEW_GAME:
      return [];
    default:
      return state;
  }
}
function bidHistory(state=[], action) {
  switch (action.type) {
    case DO_BID:
      return [
        ...state,
        action.bid
      ];
    case NEW_GAME:
      return [];
    default:
      return state;
  }
}

function cardsOnTable(state=[], action) {
  switch (action.type) {
    case PLAY_CARD:
      if (state.length === 4)
        return [{ card: action.card, player: action.player }];
      else
        return [
          ...state,
          { card: action.card, player: action.player }
        ];
    case NEW_GAME:
      return [];
    case FINISHED_TRICK:
      //return [];
      return state;
    default:
      return state;
  }
}

function handsAPIReps(
  state = {
    [SEATS.NORTH]: '',
    [SEATS.EAST]: '',
    [SEATS.SOUTH]: '',
    [SEATS.WEST]: ''
  },
  action
) {
  switch (action.type) {
    case NEW_GAME:
      return {
        [SEATS.NORTH]: getAPIrepr_cards(action.hands[SEATS.NORTH]),
        [SEATS.SOUTH]: getAPIrepr_cards(action.hands[SEATS.SOUTH]),
        [SEATS.EAST]: getAPIrepr_cards(action.hands[SEATS.EAST]),
        [SEATS.WEST]: getAPIrepr_cards(action.hands[SEATS.WEST]),
      };
    default:
      return state;
  }
}

function hands(
  state = {
    [SEATS.NORTH]: [],
    [SEATS.EAST]: [],
    [SEATS.SOUTH]: [],
    [SEATS.WEST]: []
  },
  action
) {
  switch (action.type) {
    case PLAY_CARD:
      return Object.assign({}, state, {
        [action.player]: removeCard(state[action.player], action.card)
      });
    case NEW_GAME:
      return Object.assign({}, state, {
        [SEATS.NORTH]: action.hands[SEATS.NORTH],
        [SEATS.EAST]: action.hands[SEATS.EAST],
        [SEATS.SOUTH]: action.hands[SEATS.SOUTH],
        [SEATS.WEST]: action.hands[SEATS.WEST]
      })
    default:
      return state;
  }
}
function isFetchingBotPlay(state={status:false,seat:'',card:{}}, action) {
    switch(action.type) {
      case BOTPLAYCARD_REQUEST:
        return {status: true, seat: action.player, card: {}};
      case BOTPLAYCARD_RECEIVE:
        return {status: false, seat: '', card: action.card};
      default:
        return state;
    }
}
function isFetchingBotBid(state={status:false,seat:'',bid:{}}, action) {
    switch(action.type) {
      case BOTBID_REQUEST:
        return {status: true, seat: action.player, bid: {}};
      case BOTBID_RECEIVE:
        return {status: false, seat: '', card: action.bid};
      default:
        return state;
    }
}
const initialUIState = {
  screenWidth: typeof window === 'object' ? window.innerWidth : null,
  screenHeight: typeof window === 'object' ? window.innerHeight : null,
  currentView: INGAME_VIEW,
};
function uiReducer(state = initialUIState, action) {
  switch(action.type) {
    case SCREEN_RESIZE:
      return Object.assign({}, state, {
        screenWidth: action.width,
        screenHeight: action.height,
      });
    default:
      return state;
  }
}
function gameState(state = GAMESTATES.BIDDING, action) {
  switch (action.type) {
    case START_BIDDING:
      return GAMESTATES.BIDDING;
    case FINISH_BIDDING:
      return GAMESTATES.PLAYING;
    case START_PLAYING:
      return GAMESTATES.PLAYING;
    case FINISH_PLAYING:
      return GAMESTATES.RESULTS;
    default:
      return state;
  }
}
function gameSettings(state = {}, action) {
  switch (action.type) {
    case NEW_GAME:
      return {dealer: action.dealer, vulnerability: action.vulnerability};
    case FINISH_BIDDING:
      return Object.assign({}, state, {
        declarer: action.declarer,
        contract: action.contract,
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  ui: uiReducer,
  hands,
  playHistory,
  bidHistory,
  whoseTurn,
  cardsOnTable,
  isFetchingBotPlay,
  isFetchingBotBid,
  handsAPIReps,
  gameState,
  gameSettings,
});

export default rootReducer;
