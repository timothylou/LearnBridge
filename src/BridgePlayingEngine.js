import {SEAT_NORTH, SEAT_EAST, SEAT_SOUTH, SEAT_WEST} from './Player';
import Card, {VALID_RANKS, VALID_SUITS, RANK_VALUE_MAP} from './Card';


export default class BridgePlayingEngine {
  constructor(trumpsSuit) {
    this.curTrickCards = []; // each elem: {card: cardObject, player: SEAT_XXXX}
    this.trumpsSuit = trumpsSuit;
  }
  reset() {  // call this after every getRoundWinner
    this.curTrickCards = [];
  }
  isValidCard(card, cardsInHand) { //cardsInHand is a list of cardObjects
    if (this.curTrickCards.length == 0) return true;
    const trickLeadingCardSuit = this.curTrickCards[0].card.suit;
    if (card.suit == trickLeadingCardSuit) return true;
    // check if hand contains a card with same suit as trickLeadingCardSuit
    for (let i=0; i < cardsInHand.length; i++) {
      if (cardsInHand[i].suit == trickLeadingCardSuit) return false;
    }
    return true;
  }
  playCard(card, player) {  // need to call isValidCard and isTrickOver before playCard
    this.curTrickCards.push({
      card: card,
      player: player
    });
  }
  isTrickOver() {
    return (this.curTrickCards.length == 4);
  }
  getRoundWinner() {  // call isTrickOver before getRoundWinner
    const trickLeadingCardSuit = this.curTrickCards[0].card.suit;
    let maxCard = this.curTrickCards[0];
    let foundTrump = (trickLeadingCardSuit == this.trumpsSuit);
    for (let i=1; i < 4; i++) {
      if (foundTrump) {
        if (this.curTrickCards[i].card.suit == this.trumpsSuit &&
        this.curTrickCards[i].card.value > maxCard.card.value) {
          maxCard = this.curTrickCards[i];
        }
      }
      else {
          if (this.curTrickCards[i].card.suit == this.trumpsSuit) {
            foundTrump = true;
            maxCard = this.curTrickCards[i];
          }
          else {
            if (this.curTrickCards[i].card.suit == trickLeadingCardSuit &&
              this.curTrickCards[i].value > maxCard.card.value) {
                maxCard = this.curTrickCards[i];
            }
          }
      }
    }
    return maxCard.player;
  }
}
