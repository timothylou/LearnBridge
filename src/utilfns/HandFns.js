import {RANK_VALUE_MAP} from '../constants/Game';

function _sortSuitByRank(cardA, cardB) {
  return -(RANK_VALUE_MAP[cardA.rank] - RANK_VALUE_MAP[cardB.rank]);
}

export function sortHand(trumpsSuit, cards) {
  let sortedcards = [];
  let clubs = [];
  let diamonds = [];
  let hearts = [];
  let spades = [];

  for (let i=0; i < cards.length; i++) {
    switch(cards[i].suit) {
      case 'c':
        clubs.push(cards[i]);
        break;
      case 'd':
        diamonds.push(cards[i]);
        break;
      case 'h':
        hearts.push(cards[i]);
        break;
      case 's':
        spades.push(cards[i]);
        break;
      default:
        throw 'InvalidSuitError';
    }
  }
  clubs.sort(_sortSuitByRank);
  diamonds.sort(_sortSuitByRank);
  hearts.sort(_sortSuitByRank);
  spades.sort(_sortSuitByRank);

  if (trumpsSuit==='c') sortedcards = clubs.concat(diamonds,spades,hearts);
  else if (trumpsSuit==='d') sortedcards = diamonds.concat(clubs,hearts,spades);
  else if (trumpsSuit==='h') sortedcards = hearts.concat(spades,diamonds,clubs);
  else if (trumpsSuit==='s') sortedcards = spades.concat(hearts,clubs,diamonds);
  console.log(sortedcards);
  return sortedcards;
};
