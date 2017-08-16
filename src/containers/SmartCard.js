import React from 'react';
import {connect} from 'react-redux';
import Card from '../components/Card';
import {Card_h, Card_v} from '../constants/Style';
import {SUITS, RANKS, RANK_VALUE_MAP} from '../constants/Game';

export default class SmartCard extends React.Component {
  constructor(props) {
    super(props);
    console.log('SmartCard constructor called!');
    console.log(props);
    this.value = RANK_VALUE_MAP[this.props.rank];
    this.name = this.props.rank + " of " + this.props.suit;
    this.state = {
      hover: false,
    };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  onMouseOver() {
    this.setState({ hover: true });
  }
  onMouseLeave() {
    this.setState({ hover: false });
  }
  render() {
    return (
        <Card {...this.props}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
          isMouseOver={this.props.hoverable && this.state.hover}
          cardbackToUse={this.props.cardbackToUse}
         />
    );
  }
}
/*({ rank, suit, faceup, zindex, direction, onClick, isMouseOver,
  onMouseOver, onMouseLeave, divstyle, imgstyle})*/
