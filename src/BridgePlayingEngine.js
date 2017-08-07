import {RANK_VALUE_MAP} from './constants/Game';


export default class BridgePlayingEngine {
  constructor() {
    this.curTrickCards = []; // each elem: {card: cardObject, player: SEAT_XXXX}
    this.trumpsSuit = null;
  }
  setTrumpSuit(trumpSuit) {
    this.trumpsSuit = trumpSuit;
  }
  reset() {
    this.curTrickCards = [];
    this.trumpsSuit = null;
  }
  clearTrick() {   // call this after every getRoundWinner
    this.curTrickCards = [];
  }
  isValidCard(card, cardsInHand) { //cardsInHand is a list of cardObjects
    if (this.curTrickCards.length === 0) return true;
    const trickLeadingCardSuit = this.curTrickCards[0].card.suit;
    if (card.suit === trickLeadingCardSuit) return true;
    // check if hand contains a card with same suit as trickLeadingCardSuit
    for (let i=0; i < cardsInHand.length; i++) {
      if (cardsInHand[i].suit === trickLeadingCardSuit) return false;
    }
    return true;
  }
  playCard(card, player) {  // need to call isValidCard and isTrickOver before playCard
    this.curTrickCards.push({
      card: card,
      cardvalue: RANK_VALUE_MAP[card.rank],
      player: player
    });
    console.log(this.curTrickCards);
  }
  isTrickOver() {
    return (this.curTrickCards.length === 4);
  }
  getRoundWinner() {  // call isTrickOver before getRoundWinner
    const trickLeadingCardSuit = this.curTrickCards[0].card.suit;
    let maxCard = this.curTrickCards[0];
    let foundTrump = (trickLeadingCardSuit === this.trumpsSuit);
    for (let i=1; i < 4; i++) {
      console.log(this.curTrickCards[i]);
      if (foundTrump) {
        if (this.curTrickCards[i].card.suit === this.trumpsSuit &&
        this.curTrickCards[i].cardvalue > maxCard.cardvalue) {
          maxCard = this.curTrickCards[i];
        }
      }
      else {
          if (this.curTrickCards[i].card.suit === this.trumpsSuit) {
            foundTrump = true;
            maxCard = this.curTrickCards[i];
          }
          else {
            if (this.curTrickCards[i].card.suit === trickLeadingCardSuit &&
              this.curTrickCards[i].cardvalue > maxCard.cardvalue) {
                maxCard = this.curTrickCards[i];
            }
          }
      }
    }
    console.log(foundTrump);
    console.log(maxCard);
    return maxCard.player;
  }
}
