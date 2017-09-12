import Card from './Card';
import {BID_LEVELS, BID_TYPES as BT, BID_SUITS, BID_SUIT_ORDER_MAP,
  SEATS} from './constants/Game';

export default class BridgeBiddingEngine {
  constructor() {
    this.bidHistory = [];
    this.prevSuitBid = {bid: {type: '', suit: '', level: 0}, bidder: ''};
  }
  reset() {
    this.bidHistory = [];
    this.prevSuitBid = {bid: {type: '', suit: '', level: 0}, bidder: ''};
  }
  isValidBid(bid, bidder) { // bid = {type: 'suit', suit: 'c','d','h','s','nt','pass', level= 1...7}
    if (this.bidHistory.length === 0) {
      if (bid.type === BT.PASS || bid.type === BT.SUIT) return true;
      else if (bid.type === BT.DBL || bid.type === BT.RDBL) return false;
      else throw 'InvalidBidTypeError';
    }
    if (bid.type === BT.PASS) { return true; }
    if (bid.type === BT.DBL) {
      if (this.bidHistory[this.bidHistory.length-1].bid.type === BT.SUIT)
        return true;
      else if (this.bidHistory.length >= 3) {
        if (this.bidHistory[this.bidHistory.length-1].bid.type === BT.PASS &&
            this.bidHistory[this.bidHistory.length-2].bid.type === BT.PASS &&
            this.bidHistory[this.bidHistory.length-3].bid.type === BT.SUIT) {
          return true;
        }
      }
      return false;
    }
    if (bid.type === BT.RDBL) {
      if (this.bidHistory[this.bidHistory.length-1].bid.type === BT.DBL)
        return true;
      else if (this.bidHistory.length >= 3) {
        if (this.bidHistory[this.bidHistory.length-1].bid.type === BT.PASS &&
            this.bidHistory[this.bidHistory.length-2].bid.type === BT.PASS &&
            this.bidHistory[this.bidHistory.length-3].bid.type === BT.DBL) {
          return true;
        }
      }
      return false;
    }
    if (bid.type === BT.SUIT) {
      if (this.prevSuitBid.bidder === '') { // this bid would be first suit bid
        return true;
      }
      if (this.prevSuitBid.bid.level < bid.level) { return true; }
      if (this.prevSuitBid.bid.level === bid.level &&
        BID_SUIT_ORDER_MAP[this.prevSuitBid.bid.suit] < BID_SUIT_ORDER_MAP[bid.suit]) {
        return true;
      }
      return false;
    }
    throw 'InvalidBidTypeError';
  }

  isBiddingComplete() {
    const historylen = this.bidHistory.length;
    if (historylen >= 3) {
      if (this.bidHistory[historylen-1].bid.type === BT.PASS &&
          this.bidHistory[historylen-2].bid.type === BT.PASS &&
          this.bidHistory[historylen-3].bid.type === BT.PASS) {
        if (this.prevSuitBid.bidder !== '') return true;
        else if (historylen === 4 && this.bidHistory[historylen-4].bid.type === BT.PASS) // all pass
          return true;
      }
    }
    return false;
  }

  getContract() { // call this only after isBiddingComplete returns true
    if (this.prevSuitBid.bidder === '') // the round was all pass
      return {suit: 'pass'};
    const finalBid = this.prevSuitBid;
    let seatA, seatB;
    if (finalBid.bidder === SEATS.NORTH || finalBid.bidder === SEATS.SOUTH) {
      seatA = SEATS.NORTH;;
      seatB = SEATS.SOUTH;
    }
    else {
      seatA = SEATS.EAST;
      seatB = SEATS.WEST;
    }
    for (let i=0; i<this.bidHistory.length; i++) {
      if ((this.bidHistory[i].bidder === seatA ||
        this.bidHistory[i].bidder === seatB) &&
        this.bidHistory[i].bid.type === BT.SUIT &&
        this.bidHistory[i].bid.suit === finalBid.bid.suit)
        return {
          suit: finalBid.bid.suit,
          level: finalBid.bid.level,
          declarer: this.bidHistory[i].bidder
        };
    }
    throw 'should never get here';
  }
  getBidHistory() {
    return this.bidHistory;
  }
  getPrevSuitBid() {
    return this.prevSuitBid;
  }
  addBid(bid, bidder) { // bidder = 'N', 'E', 'S', 'W', call isValidBid before calling addBid

    this.bidHistory.push({
      bid: bid,
      bidder: bidder
    });
    if (bid.type === BT.SUIT) {
      this.prevSuitBid = {
        bid: bid,
        bidder: bidder
      };
    }
    console.log("==============>",bid, bidder,this.prevSuitBid);
  }
  undoBid() {
    if (this.bidHistory.length > 0) {
      const discardedbid = this.bidHistory.pop();
    }
  }

}
