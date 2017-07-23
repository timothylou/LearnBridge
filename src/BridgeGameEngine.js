import BridgePlayingEngine from './BridgePlayingEngine';
import BridgeBiddingEngine from './BridgeBiddingEngine';
import Deck from './Deck';
import BridgeHand from './BridgeHand';


export default class BridgeGameEngine {
  constructor(dealer) {
    this.dealer = dealer; // dealer = 'N', 'S', 'E', or 'W'
    this.bidEngine = new BridgeBiddingEngine();
    this.playEngine = new BridgePlayingEngine();
    this.trickswon_NS = 0;
    this.trickswon_EW = 0;
  }



}
