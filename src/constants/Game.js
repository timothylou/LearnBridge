/* Game state constants */
export const GAMESTATES = {
  BIDDING: 'BIDDING',
  PLAYING: 'PLAYING',
  RESULTS: 'RESULTS',
  PAUSED:  'PAUSED',
};

/* Constants related to player */
export const SEATS = {
  NORTH: 'N',
  SOUTH: 'S',
  EAST: 'E',
  WEST: 'W'
};

export const PARTNERS = {
  [SEATS.NORTH]: SEATS.SOUTH,
  [SEATS.SOUTH]: SEATS.NORTH,
  [SEATS.EAST]: SEATS.WEST,
  [SEATS.WEST]: SEATS.EAST,
};

/* Constants related to a card */
export const SUITS = {
  SPADES: 's',
  HEARTS: 'h',
  DIAMONDS: 'd',
  CLUBS: 'c'
};
export const RANKS = ['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
export const RANK_VALUE_MAP = {
  '2': 2,  '3': 3,  '4' : 4,
  '5': 5,  '6': 6,  '7' : 7,
  '8': 8,  '9': 9,  'T': 10,
  'J': 11, 'Q': 12, 'K' : 13,
  'A': 14,
};

/* Constants related to bidding */
export const BID_LEVELS = [1, 2, 3, 4, 5, 6, 7];
export const BID_TYPES = {
  SUIT: 'suit',
  PASS: 'pass',
  DBL: 'double',
  RDBL: 'redouble',
};
export const BID_SUITS = {
  SPADES: 's',
  HEARTS: 'h',
  DIAMONDS: 'd',
  CLUBS: 'c',
  NOTRUMP: 'nt'
};
export const BID_SUIT_ORDER_MAP = {
  [BID_SUITS.CLUBS]: 1,
  [BID_SUITS.DIAMONDS]: 2,
  [BID_SUITS.HEARTS]: 3,
  [BID_SUITS.SPADES]: 4,
  [BID_SUITS.NOTRUMP]: 5
};
export const BID_SUIT_UNICODE_MAP = {
  [BID_SUITS.SPADES]: '\u2660',
  [BID_SUITS.HEARTS]: '\u2665',
  [BID_SUITS.DIAMONDS]: '\u2666',
  [BID_SUITS.CLUBS]: '\u2663',
  [BID_SUITS.NOTRUMP]: 'NT',
};
