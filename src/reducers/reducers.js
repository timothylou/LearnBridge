import {combineReducers} from 'redux';
import {
  PLAY_CARD,
  BOTPLAYCARD_RECEIVE, BOTPLAYCARD_REQUEST,
  NEW_GAME, PAUSE_GAME,
  FINISHED_TRICK,
  INCREMENT_WHOSETURN, SET_WHOSE_TURN,
  SCREEN_RESIZE, CHANGE_VIEW,
  START_PLAYING, FINISH_PLAYING,
  START_BIDDING, FINISH_BIDDING,
  DO_BID,
  BOTBID_RECEIVE, BOTBID_REQUEST,
  RESULTS_RECEIVE, RESULTS_REQUEST,
  TURN_START, TURN_COMPLETE,
  ADD_COINS, SUB_COINS,
  PURCHASED_ITEM,
  CHANGE_ACTIVE_CARDBACK, CHANGE_ACTIVE_CHARACTER,
  LOG_IN, SET_USER_DETAILS
} from '../actions/actions';
import {
  getAPIrepr_cards
} from '../utilfns/APIFns';
import { sortHand } from '../utilfns/HandFns';
import {
  INGAME_VIEW, HOME_SCREEN, LOG_IN_VIEW, SIGN_UP_VIEW, VERIFY_VIEW,
} from '../constants/Views';
import {BID_TYPES, BID_SUITS, SEATS, GAMESTATES} from '../constants/Game';
import {bridgeEngine} from '../BridgeGameEngine';

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
function turnCompletionStatus(state={player: '', status: false}, action) {
  switch (action.type) {
    case TURN_START:
      return {player: action.player, status: false};
    case TURN_COMPLETE:
      return {player: action.player, status: true};
    default:
      return state;
  }
}
function whoseTurn(state='',action) {
  switch (action.type) {
    case NEW_GAME:
      return action.dealer;
    case INCREMENT_WHOSETURN:
      return nextPlayer(state);
    // case FINISHED_TRICK:
    //   return action.winner;
    case SET_WHOSE_TURN:
      return action.whoseTurn;
    case FINISH_BIDDING:
      return nextPlayer(action.declarer);
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
        {bid: action.bid, bidder: action.player}
      ];
    case NEW_GAME:
      return [];
    default:
      return state;
  }
}
function biddingBoxHelpers(
  state= {
    lastSuitBid: {suit: '', level: 0, type: BID_TYPES.SUIT},
    isDblValid: false,
    isRdblValid: false,
  }, action) {
  switch (action.type) {
    case NEW_GAME:
      return {
        lastSuitBid: {suit: '', level: 0, type: BID_TYPES.SUIT},
        isDblValid: false,
        isRdblValid: false,
      };
    case DO_BID: //assumes south is always the perspective of the human bidder
      return {
        lastSuitBid: bridgeEngine.getLastSuitBid(),
        isDblValid: bridgeEngine.isValidBid({type: BID_TYPES.DBL}, SEATS.SOUTH),
        isRdblValid: bridgeEngine.isValidBid({type: BID_TYPES.RDBL}, SEATS.SOUTH)
      };
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
        [SEATS.NORTH]: sortHand(BID_SUITS.SPADES, action.hands[SEATS.NORTH]),
        [SEATS.EAST]: sortHand(BID_SUITS.SPADES, action.hands[SEATS.EAST]),
        [SEATS.SOUTH]: sortHand(BID_SUITS.SPADES, action.hands[SEATS.SOUTH]),
        [SEATS.WEST]: sortHand(BID_SUITS.SPADES, action.hands[SEATS.WEST])
      })
    case FINISH_BIDDING:
      if (action.contract.suit === BID_SUITS.NOTRUMP)
        return state;
      return Object.assign({}, state, {
        [SEATS.NORTH]: sortHand(action.contract.suit, state[SEATS.NORTH]),
        [SEATS.EAST]: sortHand(action.contract.suit, state[SEATS.EAST]),
        [SEATS.SOUTH]: sortHand(action.contract.suit, state[SEATS.SOUTH]),
        [SEATS.WEST]: sortHand(action.contract.suit, state[SEATS.WEST]),
      });
    default:
      return state;
  }
}
function isFetchingBotPlay(state={status:false,seat:'',card:{}}, action) {
    switch(action.type) {
      case NEW_GAME:
        return {status: false, seat: '', card: {}};
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
      case NEW_GAME:
        return {status: false, seat: '', bid: {}};
      case BOTBID_REQUEST:
        return {status: true, seat: action.player, bid: {}};
      case BOTBID_RECEIVE:
        return {status: false, seat: '', bid: action.bid};
      default:
        return state;
    }
}
function isFetchingResults(state={status:false,score:0,perspective:'NS'}, action) {
    switch(action.type) {
      case NEW_GAME:
        return {status: false, score: 0, perspective: 'NS'};
      case RESULTS_REQUEST:
        return {status: true, score: 0, perspective: 'NS'};
      case RESULTS_RECEIVE:
        return {status: false, score: action.score, perspective: 'NS'};
      default:
        return state;
    }
}
const initialUIState = {
  screenWidth: typeof window === 'object' ? window.innerWidth : null,
  screenHeight: typeof window === 'object' ? window.innerHeight : null,
  currentView: LOG_IN_VIEW,
};
function uiReducer(state = initialUIState, action) {
  switch(action.type) {
    case SCREEN_RESIZE:
      return Object.assign({}, state, {
        screenWidth: action.width,
        screenHeight: action.height,
      });
    case CHANGE_VIEW:
      return Object.assign({}, state, {
        currentView: action.nextView,
      });
    default:
      return state;
  }
}
function tricksTaken(state= {NS: 0, EW: 0}, action) {
  switch (action.type) {
    case NEW_GAME:
      return {NS: 0, EW: 0};
    case FINISHED_TRICK:
      if (action.winner === SEATS.NORTH || action.winner === SEATS.SOUTH)
        return Object.assign({}, state, {
          NS: state.NS + 1,
        });
      else
        return Object.assign({}, state, {
          EW: state.EW + 1,
        });
    default:
      return state;
  }
}
function coins(state=0, action) {
  switch (action.type) {
    case ADD_COINS:
      return state + action.qty;
    case SUB_COINS:
      return (state >= action.qty) ? (state - action.qty) : 0;
    case SET_USER_DETAILS:
      return action.coins;
    default:
      return state;
  }
}
function purchasedItems(state={cardback: [], character: []}, action) {
  switch (action.type) {
    case PURCHASED_ITEM:
      return Object.assign({}, state, {
        [action.itemType]: [
          ...state[action.itemType],
          action.itemID
        ]
      });
    case SET_USER_DETAILS:
      return {
        cardback: action.purchasedItems.cardbacks,
        character: action.purchasedItems.characters,
      };
    default:
      return state;
  }
}
function activeCardbackID(state='Blue', action) {
  switch (action.type) {
    case CHANGE_ACTIVE_CARDBACK:
      return action.cardback;
    case SET_USER_DETAILS:
      return action.activeItems.activeCardbackID;
    default:
      return state;
  }
}
function activeCharacterID(state='1', action) {
  switch (action.type) {
    case CHANGE_ACTIVE_CHARACTER:
      return action.character;
    case SET_USER_DETAILS:
      return action.activeItems.activeCharacterID;
    default:
      return state;
  }
}
function gameState(state = GAMESTATES.BIDDING, action) {
  switch (action.type) {
    case NEW_GAME:
      return GAMESTATES.BIDDING;
    case START_BIDDING:
      return GAMESTATES.BIDDING;
    case FINISH_BIDDING:
      return GAMESTATES.PLAYING;
    case START_PLAYING:
      return GAMESTATES.PLAYING;
    case FINISH_PLAYING:
      return GAMESTATES.RESULTS;
    case PAUSE_GAME:
      return GAMESTATES.PAUSED;
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

function userID(state='', action) {
  switch (action.type) {
    case LOG_IN:
      return action.userID;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  ui: uiReducer,
  hands,
  biddingBoxHelpers,
  playHistory,
  bidHistory,
  whoseTurn,
  cardsOnTable,
  isFetchingBotPlay,
  isFetchingBotBid,
  isFetchingResults,
  turnCompletionStatus,
  handsAPIReps,
  gameState,
  gameSettings,
  tricksTaken,
  coins,
  purchasedItems,
  activeCardbackID,
  activeCharacterID,
  userID,
});

export default rootReducer;
