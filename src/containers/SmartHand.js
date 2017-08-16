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
    const cardHeight = (this.props.screenHeight - this.props.screenHeight%50)/5;
    const cardWidth = cardHeight*7/10;
    const reactcardslist = this.props.rawcardslist.map((card, idx) => {
      return (
          <SmartCard
            rank={card.rank}
            suit={card.suit}
            zindex={idx}
            key={card.suit+card.rank}
            onClick={this.onCardClick}
            faceup={this.props.faceup}
            cardbackToUse={this.props.cardbackToUse}
            direction={this.props.direction}
            hoverable={this.props.hoverable}
            offsetFromLeft={0}
            imgstyle={{
              width: cardWidth,
              height: cardHeight
            }}
            divstyle={{
              width: cardWidth,
              height: cardHeight,
              left: cardWidth/5*idx
            }}
          />
      );
    });
    return (
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: this.props.offsetFromLeft,
        height: cardHeight,
        width: (cardWidth+cardWidth/5*(this.props.rawcardslist.length-1)).toString() + 'px',
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
    rawcardslist: state.hands[ownProps.seat],
    screenWidth: state.ui.screenWidth,
    screenHeight: state.ui.screenHeight,
    cardbackToUse: state.activeCardbackID,
  }
};
// export default SmartHand;
export default connect(mapStateToProps)(SmartHand);
