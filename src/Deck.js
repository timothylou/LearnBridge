import Card, {VALID_SUITS, VALID_RANKS} from './Card';

export default class Deck {
  constructor() {
    this.deck = new Array(52);
    for (let isuit = 0; isuit < VALID_SUITS.length; isuit++) {
      for (let irank = 0; irank < VALID_RANKS.length; irank++) {
        this.deck[isuit*VALID_RANKS.length + irank] = {
          rank: VALID_RANKS[irank],
          suit: VALID_SUITS[isuit],
        };
      }
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
