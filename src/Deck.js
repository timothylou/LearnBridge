import Card from './Card';
import {RANKS, SUITS} from './constants/Game';

export default class Deck {
  constructor() {
    this.deck = new Array(52);
    let scount = 0;
    for (let suit in SUITS) {
      for (let irank = 0; irank < RANKS.length; irank++) {
        this.deck[scount*RANKS.length + irank] = {
          rank: RANKS[irank],
          suit: SUITS[suit],
        };
      }
      scount += 1;
    }
  }
  getCards() {
    return this.deck;
  }
  generateHands() {
    return [this.deck.slice(0,13),this.deck.slice(13,26),
      this.deck.slice(26,39),this.deck.slice(39,52)];
  }
  shuffle() {
    let currentIndex = this.deck.length;
    let temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = this.deck[currentIndex];
      this.deck[currentIndex] = this.deck[randomIndex];
      this.deck[randomIndex] = temporaryValue;
    }
  }
}
