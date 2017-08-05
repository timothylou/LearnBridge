import {combineReducers} from 'redux';
import {
  PLAY_CARD,
  BOTPLAYCARD_RECEIVE,
  BOTPLAYCARD_REQUEST,
  NEW_GAME,
  FINISHED_TRICK,
} from '../actions/actions';
import {SEATS} from '../constants/Game';

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
    case PLAY_CARD:
      return nextPlayer(state);
    case FINISHED_TRICK:
      return action.winner;
    default:
      return state;
  }
}
function history(state=[],action) {
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
function cardsOnTable(state=[], action) {
  switch (action.type) {
    case PLAY_CARD:
      return [
        ...state,
        { card: action.card, player: action.player }
      ];
    case NEW_GAME:
      return [];
    case FINISHED_TRICK:
      return [];
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


const rootReducer = combineReducers({
  hands,
  history,
  whoseTurn,
  cardsOnTable,
  isFetchingBotPlay,
});

export default rootReducer;
