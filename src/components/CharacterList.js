import React from 'react';
import ReactList from 'react-list';
import {CHARACTERS_DETAILS_LIST} from '../constants/Characters';

const getItemAttr = (itemType, itemID, attr) => {
  if (itemType === 'character') {
    for (let i=0; i<CHARACTERS_DETAILS_LIST.length; i++) {
      if (CHARACTERS_DETAILS_LIST[i].id === itemID)
        return CHARACTERS_DETAILS_LIST[i][attr];
    }
  }
  else if (itemType === 'cardback') {
    return 'blah';
  }
}

export default class CharacterList extends React.Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }
  renderItem(index, key) {
    const characterImg = require('../storeimages/characters/image'+this.props.characters[index]+'.png');
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
          src={characterImg}
          onClick={()=>{
            console.log('character clicked:', this.props.characters[index]);
            this.props.onCharacterClick(this.props.characters[index]);
          }}
          style={{
            height: 'auto',
            width: 'auto',
            maxWidth: '150px',
            maxHeight: '150px',
            marginTop: '10px',
            border: '1px solid black',
            cursor: 'pointer',
          }}
        />
        <div>
          {
            (getItemAttr('character',this.props.characters[index],'price')).toString()
            + ' \u0243'
          }
        </div>
      </div>
    );
  }
  render() {
    return (
      <div>
        <h1>Characters</h1>
        <div style={{
          overflow: 'auto',
          maxWidth: '100%',
          // maxHeight: '200px'
        }}>
          <ReactList
            axis='x'
            itemRenderer={this.renderItem}
            length={this.props.characters.length}
            type='uniform'
          />
        </div>
      </div>
    );
  }
}
