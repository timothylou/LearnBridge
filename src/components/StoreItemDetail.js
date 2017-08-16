import React from 'react';
import {CHARACTERS_DETAILS_LIST} from '../constants/Characters';
import {CARDBACKS_DETAILS_LIST} from '../constants/Cardbacks';
import '../styles/CardStyles.css';

const getItemAttr = (itemType, itemID, attr) => {
  if (itemType === 'character') {
    for (let i=0; i<CHARACTERS_DETAILS_LIST.length; i++) {
      if (CHARACTERS_DETAILS_LIST[i].id === itemID)
        return CHARACTERS_DETAILS_LIST[i][attr];
    }
  }
  else if (itemType === 'cardback') {
    for (let i=0; i<CARDBACKS_DETAILS_LIST.length; i++) {
      if (CARDBACKS_DETAILS_LIST[i].id === itemID)
        return CARDBACKS_DETAILS_LIST[i][attr];
    }
  }
}
const StoreItemDetail = ({
  itemType, itemID, itemPrice, itemDesc, itemName, itemImgExt, isBuyable,
  onPurchaseItemClick, haveItem, isActivated, onActivateItemClick,
}) => {
  let fullimg = null;
  switch (itemType) {
    case "character":
      fullimg = require('../storeimages/characters/'+'image'+itemID.toString()+'.'+itemImgExt);
      break;
    case "cardback":
      fullimg = require('../storeimages/cardbacks/'+itemID.toString()+'.'+itemImgExt);
      break;
    default:
      console.log('?  ?   ?    ?  ? ');
      break;
  }

  return (
    fullimg ? (
      <div style={{
        height: '100%',
        width: '100%',
      }}>
        <div style={{
          height: '50%',
          width: '100%',
          border: '2px solid yellow',
        }}>
          <img
            src={fullimg}
            style={{
              height: '100%',
              width: 'auto',
              display: 'block',
              margin: 'auto',
              // maxHeight: '50%',
              // height: 'auto',
              border: '1px solid brown',
            }}
          />
        </div>
        <div>
          <h2>{getItemAttr(itemType, itemID,'name')}</h2>
          <p>{getItemAttr(itemType, itemID,'description')}</p>
        </div>
        <div>
          {'Price: ' + itemPrice.toString()}
        </div>
        <div>
          <button
            className={isBuyable ? "clickablePurchaseItemButton" : "unclickablePurchaseItemButton"}
            onClick={isBuyable ? (()=>{
              onPurchaseItemClick(itemType, itemID, itemPrice);
            }) : (()=>{})}
          >
            Purchase
          </button>
          {haveItem &&
            <button
              className={!isActivated ? "clickablePurchaseItemButton" : "unclickablePurchaseItemButton"}
              onClick={!isActivated ? (()=>{
                onActivateItemClick(itemType, itemID);
              }) : (()=>{})}
            >
              Activate
            </button>
          }
        </div>
      </div>
    ) : <div>Click an item for more information!</div>
  );
}

export default StoreItemDetail;
