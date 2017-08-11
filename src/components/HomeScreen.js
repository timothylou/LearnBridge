import React from 'react';


const HomeScreen = ({onPlayGameClick, onGotoStoreClick}) => {

  const playGameButton = (
    <button
      className="clickablePassBidButton"
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
      className="clickablePassBidButton"
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

        {"Let\'s Play Bridge!!!!!!!"}
      </div>
      <div>
        {playGameButton}
      </div>
      <div>
        {gotoStoreButton}
      </div>
    </div>
  );
}

export default HomeScreen;
