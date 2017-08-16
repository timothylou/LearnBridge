import HomeScreen from '../components/HomeScreen';
import React from 'react';
import {connect} from 'react-redux';
import {
  INGAME_VIEW, HOME_SCREEN, STORE_VIEW,
} from '../constants/Views';
import {
  changeView, newGame
} from '../actions/actions';

class SmartHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.onPlayGameClick = this.onPlayGameClick.bind(this);
    this.onGotoStoreClick = this.onGotoStoreClick.bind(this);
  }
  onPlayGameClick() {
    this.props.dispatch(changeView(INGAME_VIEW));
  }
  onGotoStoreClick() {
    this.props.dispatch(changeView(STORE_VIEW));
  }
  render() {

    return (
      <HomeScreen
        onPlayGameClick={this.onPlayGameClick}
        onGotoStoreClick={this.onGotoStoreClick}
      />
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    currentView: state.ui.currentView,
  }
};

export default connect(mapStateToProps)(SmartHomeScreen);
