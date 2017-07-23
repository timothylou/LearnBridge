import './BridgeHand';
import './Deck';
import './Card';


export const SEAT_NORTH = 'N';
export const SEAT_SOUTH = 'S';
export const SEAT_EAST  = 'E';
export const SEAT_WEST  = 'W';

export default class Player {
  constructor(seatDirection, hand, bot) {
    this.seatDirection = seatDirection;
    this.hand = hand;
    this.isBot = bot;
  }


}
