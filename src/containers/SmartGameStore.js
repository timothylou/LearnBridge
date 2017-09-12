import React from 'react';
import {connect} from 'react-redux';
import CharacterList from '../components/CharacterList';
import CardbackList from '../components/CardbackList';
import StoreItemDetail from '../components/StoreItemDetail';
import {CHARACTERS_DETAILS_LIST} from '../constants/Characters';
import {CARDBACKS_DETAILS_LIST} from '../constants/Cardbacks';
import {addCoins, subCoins, purchasedItem,
  changeActiveCardback, changeActiveCharacter,
} from '../actions/actions';
import Firebase from '../Firebase';

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

class SmartGameStore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewItemType: null,
      previewItemID: null,
    };
    this.onCardbackClick = this.onCardbackClick.bind(this);
    this.onCharacterClick = this.onCharacterClick.bind(this);
    this.checkIfBuyable = this.checkIfBuyable.bind(this);
    this.haveItem = this.haveItem.bind(this);
    this.onPurchaseItemClick = this.onPurchaseItemClick.bind(this);
    this.onActivateItemClick = this.onActivateItemClick.bind(this);
  }
  onCardbackClick(itemID) {
    this.setState({
      previewItemID: itemID,
      previewItemType: 'cardback',
    });
  }
  onCharacterClick(itemID) {
    this.setState({
      previewItemID: itemID,
      previewItemType: 'character',
    });
  }
  onActivateItemClick(itemType, itemID) {
    let userDatabasePath;
    switch (itemType) {
      case 'character':
        this.props.dispatch(changeActiveCharacter(itemID));
        userDatabasePath = '/users/'+ this.props.userID+'/gamedata';
        Firebase.database().ref(userDatabasePath).update({activeCharacter: itemID });
        break;
      case 'cardback':
        this.props.dispatch(changeActiveCardback(itemID));
        userDatabasePath = '/users/'+ this.props.userID+'/gamedata';
        Firebase.database().ref(userDatabasePath).update({activeCardback: itemID });
        break;
      default:
        console.log('what');
        break;
    }
  }
  checkIfBuyable(itemType, itemID) {
    if (!this.state.previewItemID) return false;
    if (this.haveItem(itemType, itemID))
      return false;
    if (getItemAttr(itemType, itemID, 'price') <= this.props.coins)
      return true;
    return false;
  }
  onPurchaseItemClick(itemType, itemID, purchasePrice) {
    const userDatabasePath = '/users/'+ this.props.userID+'/gamedata';
    const numCoins = this.props.coins;
    Firebase.database().ref(userDatabasePath).update({numCoins: numCoins-purchasePrice });
    let itemsPath = '/users/' + this.props.userID+'/gamedata';
    if (itemType === 'character') {
      itemsPath += '/characters';
    }
    else if (itemType === 'cardback') {
      itemsPath += '/cardbacks';
    }
    // let newItemKey = Firebase.database().ref(itemsPath).push().key;
    // Firebase.database().ref(itemsPath+'/'+newItemKey).update({
    //   itemID: itemID,
    //   active: false,
    // });
    Firebase.database().ref(itemsPath+'/'+itemID).update({
      placeholder: "blah",
    });

    this.props.dispatch(subCoins(purchasePrice));
    this.props.dispatch(purchasedItem(itemType, itemID));
  }
  haveItem(itemType, itemID) {
    if (!itemType) return false;
    for (let i=0; i<this.props.purchasedItems[itemType].length; i++) {
      if (this.props.purchasedItems[itemType][i] === itemID)
        return true;
    }
    return false;
  }
  render() {
    return (
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#bfeaea',
      }}>
        <div style={{
          position: 'fixed',
          left: '1%',
          width: '30%',
          height: '90%',
          border: '3px solid teal',
        }}>
          <StoreItemDetail
            itemType={this.state.previewItemType}
            itemID={this.state.previewItemID}
            itemPrice={getItemAttr(this.state.previewItemType, this.state.previewItemID, 'price')}
            itemImgExt='png'
            isBuyable={this.checkIfBuyable(this.state.previewItemType, this.state.previewItemID)}
            onPurchaseItemClick={this.onPurchaseItemClick}
            haveItem={this.haveItem(this.state.previewItemType, this.state.previewItemID)}
            isActivated={
              (this.state.previewItemType === 'character') ?
              (this.props.activeCharacterID === this.state.previewItemID)
              : (this.props.activeCardbackID === this.state.previewItemID)}
            onActivateItemClick={this.onActivateItemClick}
          />
        </div>
        <div style={{
          position: 'fixed',
          left: '35%',
          width: '60%',
          height: '90%',
          border: '3px solid pink'
        }}>
          <CharacterList
            characters={CHARACTERS_DETAILS_LIST.map((elem)=>elem.id)}
            onCharacterClick={this.onCharacterClick}
          />
          <CardbackList
            cardbacks={CARDBACKS_DETAILS_LIST.map((elem)=>elem.id)}
            onCardbackClick={this.onCardbackClick}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    coins: state.coins,
    purchasedItems: state.purchasedItems,
    activeCardbackID: state.activeCardbackID,
    activeCharacterID: state.activeCharacterID,
    userID: state.userID,
  }
}
export default connect(mapStateToProps)(SmartGameStore);
