import {SEAT_NORTH, SEAT_EAST, SEAT_SOUTH, SEAT_WEST} from './Player';
import Card, {VALID_RANKS, VALID_SUITS, RANK_VALUE_MAP} from './Card';

const VALID_BID_LEVELS = [1, 2, 3, 4, 5, 6, 7];
const VALID_BID_SUITS = ['c', 'd', 'h', 's', 'nt'];
const BID_SUIT_ORDER_MAP = {
  'c': 1, 'd': 2, 'h': 3, 's': 4, 'nt': 5,
};
const BID_SUIT = 'suit';
const BID_PASS = 'pass';
const BID_DBL  = 'double';
const BID_RDBL = 'redouble';

export default class BridgeBiddingEngine {
  constructor() {
    this.bidHistory = [];
    this.prevSuitBid = {bid: {type: '', suit: '', level: 0}, bidder: ''};
  }

  isValidBid(bid, bidder) { // bid = {type: 'suit', suit: 'c','d','h','s','nt','pass', level= 1...7}
    if (this.bidHistory.length === 0) {
      if (bid.type === BID_PASS || bid.type === BID_SUIT) return true;
      else if (bid.type === BID_DBL || bid.type === BID_RDBL) return false;
      else throw 'InvalidBidTypeError';
    }
    if (bid.type === BID_PASS) { return true; }
    if (bid.type === BID_DBL) {
      if (this.bidHistory[this.bidHistory.length-1].bid.type === BID_SUIT)
        return true;
      else if (this.bidHistory.length >= 3) {
        if (this.bidHistory[this.bidHistory.length-1].bid.type === BID_PASS &&
            this.bidHistory[this.bidHistory.length-2].bid.type === BID_PASS &&
            this.bidHistory[this.bidHistory.length-3].bid.type === BID_SUIT) {
          return true;
        }
      }
      return false;
    }
    if (bid.type === BID_RDBL) {
      if (this.bidHistory[this.bidHistory.length-1].bid.type === BID_DBL)
        return true;
      else if (this.bidHistory.length >= 3) {
        if (this.bidHistory[this.bidHistory.length-1].bid.type === BID_PASS &&
            this.bidHistory[this.bidHistory.length-2].bid.type === BID_PASS &&
            this.bidHistory[this.bidHistory.length-3].bid.type === BID_DBL) {
          return true;
        }
      }
      return false;
    }
    if (bid.type === BID_SUIT) {
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
      if (this.bidHistory[historylen-1].bid.type === BID_PASS &&
          this.bidHistory[historylen-2].bid.type === BID_PASS &&
          this.bidHistory[historylen-3].bid.type === BID_PASS) {
        if (this.prevSuitBid.bidder !== '') return true;
        else if (historylen === 4 && this.bidHistory[historylen-4].bid.type === BID_PASS)
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
    if (finalBid.bidder === SEAT_NORTH || finalBid.bidder === SEAT_SOUTH) {
      seatA = SEAT_NORTH;;
      seatB = SEAT_SOUTH;
    }
    else {
      seatA = SEAT_EAST;
      seatB = SEAT_WEST;
    }
    for (let i=0; i<this.bidHistory.length; i++) {
      if ((this.bidHistory[i].bidder === seatA ||
        this.bidHistory[i].bidder === seatB) &&
        this.bidHistory[i].bid.type === BID_SUIT &&
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
  addBid(bid, bidder) { // bidder = 'N', 'E', 'S', 'W', call isValidBid before calling addBid
    this.bidHistory.push({
      bid: bid,
      bidder: bidder
    });
    if (bid.type === BID_SUIT) {
      this.prevSuitBid = {
        bid: bid,
        bidder: bidder
      };
    }
  }
  undoBid() {
    if (this.bidHistory.length > 0) {
      const discardedbid = this.bidHistory.pop();
    }
  }

}
