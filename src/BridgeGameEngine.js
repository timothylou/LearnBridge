import BridgePlayingEngine from './BridgePlayingEngine';
import BridgeBiddingEngine from './BridgeBiddingEngine';
import Deck from './Deck';
import Card, {RANK_VALUE_MAP, VALID_SUITS, VALID_RANKS} from './Card';
import BridgeHand from './BridgeHand';
import {SEAT_NORTH, SEAT_SOUTH, SEAT_EAST, SEAT_WEST} from './Player';


export default class BridgeGameEngine {
  constructor(dealer) {
    this.dealer = dealer; // dealer = 'N', 'S', 'E', or 'W'
    this.bidEngine = new BridgeBiddingEngine();
    this.playEngine = new BridgePlayingEngine();
    // for debug:
    this.playEngine.setTrumpSuit('h');
    this.trickswon_NS = 0; // maybe can just store this in GameBoard
    this.trickswon_EW = 0; // maybe can just store this in GameBoard
  }

  isValidCard(card, cardsInHand) {
    return this.playEngine.isValidCard(card, cardsInHand);
  }

  playCard(card, player) {
    this.playEngine.playCard(card, player);
  }

  isTrickOver() {
    return this.playEngine.isTrickOver();
  }

  getRoundWinner() {
    const winner = this.playEngine.getRoundWinner();
    if (winner === SEAT_NORTH || winner === SEAT_SOUTH) this.trickswon_NS++;
    else this.trickswon_EW++;
    return winner;
  }

  clearBoard() {
    this.playEngine.reset();
  }

  getScore() {
    return 0;
  }


}
