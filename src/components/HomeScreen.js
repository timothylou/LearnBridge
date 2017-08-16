import React from 'react';


const HomeScreen = ({onPlayGameClick, onGotoStoreClick}) => {

  const playGameButton = (
    <button
      className="clickableStartPlayingButton"
      onClick={()=>{
        console.log('u clicked the playGameButton');
        onPlayGameClick();
      }}
    >
      Play random game
    </button>
  );
  const gotoStoreButton = (
    <button
      className="clickableGoToStoreButton"
      onClick={()=>{
        console.log('u clicked the gotoStoreButton');
        onGotoStoreClick();
      }}
    >
      Shop at store
    </button>
  );
  return (
    <div
    >
      <div
        className="homescreenTitleFont"
        style={{
          position: 'absolute',
          top: '10%',
          width: '100%'
        }}
      >
        {"Bridge Buddies"}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '40%',
        }}
      >
        {playGameButton}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '40%',
        }}
      >
        {gotoStoreButton}
      </div>
    </div>
  );
}

export default HomeScreen;
