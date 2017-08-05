import React, { Component } from 'react';
import Deck from './Deck';
import {SEATS} from './constants/Game';
import SmartCard from './containers/SmartCard';
import SmartHand from './containers/SmartHand';
import SmartPlayer from './containers/SmartPlayer';
import SmartTable from './containers/SmartTable';
import { newGame } from './actions/actions';

class App extends Component {

  render() {
    // return (
    //   <div style={{
    //     backgroundColor: 'white',
    //     position: 'absolute',
    //     width: '75%',
    //     height: '80%',
    //     top: '5%',
    //     left: '5%',
    //     border: '4px solid #00FFFF',
    //     id: 'gameboardidtest'
    //   }}>
    //     <GameBoard
    //       dealer={SEATS.NORTH}
    //       northHand={hands[0]}
    //       southHand={hands[1]}
    //       eastHand={hands[2]}
    //       westHand={hands[3]}
    //     />
    //   </div>
    // );
    // return (
    //   <SmartHand
    //     seat='N'
    //     faceup={true}
    //     direction='vertical'
    //     isValidCardClick={({rank, suit})=>{return true;}}
    //     onValidCardClick={({rank, suit})=>{console.log('hia');}}
    //   />
    // )
    // return (
    //   <SmartPlayer
    //     seat='N'
    //     faceup={true}
    //     isBot={false}
    //     isMyTurn={true}
    //   />
    // )
    return (
      <SmartTable
        dealer='N'
      />
    );
  }
}

export default App;
