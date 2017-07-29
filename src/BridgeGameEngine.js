import BridgePlayingEngine from './BridgePlayingEngine';
import BridgeBiddingEngine from './BridgeBiddingEngine';
import Deck from './Deck';
import BridgeHand from './BridgeHand';
import {SEATS} from './constants/Game';


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
    if (winner === SEATS.NORTH || winner === SEATS.SOUTH) this.trickswon_NS++;
    else this.trickswon_EW++;
    return winner;
  }

  clearBoard() {
    this.playEngine.reset();
  }

  getNSScore() {
    return this.trickswon_NS;
  }
  getEWScore() {
    return this.trickswon_EW;
  }


}
