
export const PLAY_CARD = 'PLAY_CARD';
export const BOTPLAYCARD_REQUEST = 'BOTPLAYCARD_REQUEST';
export const BOTPLAYCARD_RECEIVE = 'BOTPLAYCARD_RECEIVE';
export const NEW_GAME = 'NEW_GAME';
export const FINISHED_TRICK = 'FINISHED_TRICK';


export const newGame = (dealer, hands, vulnerability) => ({
  type: NEW_GAME,
  dealer,
  hands,
  vulnerability
});

export const playCard = (card, player) => ({
  type: PLAY_CARD,
  player,
  card,
});

export const finishedTrick = (winner) => ({
  type: FINISHED_TRICK,
  winner
});

export const requestBotPlayCard = (player) => ({
  type: BOTPLAYCARD_REQUEST,
  player
});

export const receiveBotPlayCard = (player, card) => ({
  type: BOTPLAYCARD_RECEIVE,
  player,
  card // maybe dont need this? can just call playcard next
});

// a friggin THUNK action creator!
export function fetchBotPlayCard (player, url) {
  return function (dispatch)  {
    dispatch(requestBotPlayCard(player));
    let suit;
    let rank;
    return fetch(url).then(
      response => response.text(),
      error => console.log('An error occurred.', error)
    )
    .then(text => {
      console.log(text);
      const retxml = text;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(retxml,"text/xml");
      const rets = xmlDoc.getElementsByTagName("r");
      let cardToPlay = "";
      for (let i=0; i < rets.length; i++) {
        if (rets[i].getAttribute('type') === 'play') {
          cardToPlay = rets[i].getAttribute('card');
          console.log("fetchBotPlayCard dispatch: fetched card to play: " + cardToPlay);
        }
      }
      if (cardToPlay === "") {
        console.log("fetchBotPlayCard dispatch: something went wrong.");
      }
      suit = cardToPlay[0].toLowerCase();
      rank = cardToPlay[1].toUpperCase();
      return dispatch(receiveBotPlayCard(player, {suit, rank}));
    });
  };
}
