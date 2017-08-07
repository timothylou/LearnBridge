import {SUITS, BID_TYPES} from '../constants/Game';

export function getAPIrepr_cards(cards) {
  let spades = '', hearts = '', diamonds = '', clubs = '';

  for (let i=0; i<cards.length; i++) {
    switch (cards[i].suit) {
      case SUITS.SPADES:
        spades += cards[i].rank;
        break;
      case SUITS.HEARTS:
        hearts += cards[i].rank;
        break;
      case SUITS.DIAMONDS:
        diamonds += cards[i].rank;
        break;
      case SUITS.CLUBS:
        clubs += cards[i].rank;
        break;
      default:
        console.log('dont go here please');
        break;
    }
  }
  return spades + '.' + hearts + '.' + diamonds + '.' + clubs;
}

export function getAPIrepr_playhistory(playHistory) {
  let repr = "";
  for (let i=0; i<playHistory.length; i++) {
    repr += playHistory[i].suit.toUpperCase() + playHistory[i].rank.toUpperCase();
    if (i != playHistory.length - 1)
      repr += "-"
  }
  return repr;
}

const bidToString = (bid) => {
  switch (bid.type) {
    case BID_TYPES.PASS:
      return "P";
    case BID_TYPES.DBL:
      return "X";
    case BID_TYPES.RDBL:
      return "XX";
    case BID_TYPES.SUIT:
      return bid.level.toString()+bid.suit;
    default:
      return "lol";
  }
}

export function getAPIrepr_bidhistory(bidHistory) {
  let repr = "";
  for (let i=0; i<bidHistory.length; i++) {
    repr += bidToString(bidHistory[i].bid);
    if (i != bidHistory.length - 1)
      repr += "-"
  }
  return repr;
}
