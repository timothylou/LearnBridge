import BridgePlayingEngine from './BridgePlayingEngine';
import BridgeBiddingEngine from './BridgeBiddingEngine';
import {SEATS} from './constants/Game';


class BridgeGameEngine {
  constructor() {
    // this.dealer = dealer; // dealer = 'N', 'S', 'E', or 'W'
    this.bidEngine = new BridgeBiddingEngine();
    this.playEngine = new BridgePlayingEngine();
    // for debug:
    // this.playEngine.setTrumpSuit('h');
    this.trickswon_NS = 0; // maybe can just store this in GameBoard
    this.trickswon_EW = 0; // maybe can just store this in GameBoard
    // this.playCard = this.playCard.bind(this);
  }

  /* Initialization fns */
  reset() {
    this.playEngine.reset();
    this.bidEngine.reset();
  }
  setDealer(dealer) {
    this.dealer = dealer;
  }

  setTrumpSuit(suit) {
    this.playEngine.setTrumpSuit(suit);
  }

  /* Bidding fns */
  isValidBid(bid, bidder) {
    return this.bidEngine.isValidBid(bid, bidder);
  }

  doBid(bid, bidder) {
    this.bidEngine.addBid(bid, bidder);
  }

  isBiddingComplete() {
    return this.bidEngine.isBiddingComplete();
  }

  getContract() {
    return this.bidEngine.getContract();
  }

  getLastSuitBid() {
    return this.bidEngine.getPrevSuitBid().bid;
  }

  /* Playing card fns */
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

  clearTrick() {
    this.playEngine.clearTrick();
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

export let bridgeEngine = new BridgeGameEngine();
