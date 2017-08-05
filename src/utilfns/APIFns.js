import {SUITS} from '../constants/Game';

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
