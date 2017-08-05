import React from 'react';
import {connect} from 'react-redux';
import SmartCard from './SmartCard';
import Deck from '../Deck';
import { newGame } from '../actions/actions';

class SmartHand extends React.Component {
  constructor(props) {
    super(props);
    console.log('SmartHand constructor called!');
    this.onCardClick = this.onCardClick.bind(this);
  }


  onCardClick(crank, csuit) {
    console.log('SmartHand: Card ' + crank + ' of ' + csuit + ' clicked!');
    if (this.props.isValidCardClick({rank: crank, suit: csuit})) {
        this.props.onValidCardClick({rank: crank, suit: csuit});
    }
  }
  render() {
    const reactcardslist = this.props.rawcardslist.map((card, idx) => {
      return (
          <SmartCard
            rank={card.rank}
            suit={card.suit}
            zindex={idx}
            key={card.suit+card.rank}
            onClick={this.onCardClick}
            faceup={this.props.faceup}
            direction={this.props.direction}
            offsetFromLeft={0}
          />
      );
    });
    return (
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: this.props.offsetFromLeft,
        height: '200px',
        width: (140+30*(this.props.rawcardslist.length-1)).toString() + 'px',
        border: '3px solid #73AD21',
        transform: 'rotate(0deg)',
      }}>
        {reactcardslist}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    rawcardslist: state.hands[ownProps.seat]
  }
};
// export default SmartHand;
export default connect(mapStateToProps)(SmartHand);
