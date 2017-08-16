import React from 'react';
import ReactList from 'react-list';
import {CARDBACKS_DETAILS_LIST} from '../constants/Cardbacks';

const getItemAttr = (itemType, itemID, attr) => {
  if (itemType === 'cardback') {
    for (let i=0; i<CARDBACKS_DETAILS_LIST.length; i++) {
      if (CARDBACKS_DETAILS_LIST[i].id === itemID)
        return CARDBACKS_DETAILS_LIST[i][attr];
    }
  }
  return null;
}

export default class CardbackList extends React.Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }
  renderItem(index, key) {
    const cardbackImg = require('../storeimages/cardbacks/'+this.props.cardbacks[index]+'.png');
    return (
      <div
        key={key}
        style={{
          display: 'inline-block',
          // lineHeight: '100px',
          padding: 0,
          width: '150px',
          height: '200px',
          textAlign: 'center',
          background: (index % 2 == 0) ? 'lightblue' : 'lightgreen',
        }}
      >
        <img
          src={cardbackImg}
          onClick={()=>{
            console.log('cardback clicked:', this.props.cardbacks[index]);
            this.props.onCardbackClick(this.props.cardbacks[index]);
          }}
          style={{
            height: 'auto',
            width: 'auto',
            maxWidth: '150px',
            maxHeight: '150px',
            marginTop: '20px',
            border: '1px solid black',
            cursor: 'pointer',
          }}
        />
        <div>
          {
            (getItemAttr('cardback',this.props.cardbacks[index],'price')).toString()
            + ' \u0243'
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      <div>
        <h1>Cardbacks</h1>
        <div style={{
          overflow: 'auto',
          maxWidth: '100%',
          // maxHeight: '200px'
        }}>
          <ReactList
            axis='x'
            itemRenderer={this.renderItem}
            length={this.props.cardbacks.length}
            type='uniform'
          />
        </div>
      </div>
    );
  }
}
