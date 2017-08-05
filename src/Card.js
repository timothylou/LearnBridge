import React from 'react';
import {Card_h, Card_v} from './constants/Style';
import {SUITS, RANKS, RANK_VALUE_MAP} from './constants/Game';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    console.log('Card constructor called!');
    console.log(props);
    this.value = RANK_VALUE_MAP[this.props.rank];
    this.name = this.props.rank + " of " + this.props.suit;
    this.state = {
      hover: false,
    };
  }

  render() {
    const cardimg = this.props.faceup ?
     require('./cardimages/'+this.value.toString()+this.props.suit.toUpperCase()+'.png')
     : require('./cardimages/back_card.gif');
    const width = (this.props.direction === 'horizontal') ? 140 : 140;
    const height = (this.props.direction === 'horizontal') ? 200 : 200;
    return (
        <div style={{
          position: 'absolute',
          left: 30*this.props.zindex+this.props.offsetFromLeft,
          transform: (this.state.hover ? 'translate(0,-10px)' : ''),
          padding: 0,
          width: width,
          height: height,
          zIndex: this.props.zindex,
          border: '1px solid #0000DA',
        }}>
          <img
            src={cardimg}
            onClick={()=>{console.log('hi ' + this.name);
                          this.props.onClick(this.props.rank, this.props.suit);}}
            onMouseOver={()=>{this.setState({hover: true});}}
            onMouseLeave={()=>{this.setState({hover: false});}}
            width={width}
            height={height}
            alt="the card was supposed to show up"
          />
        </div>
    );
  }
}
