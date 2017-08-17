import Firebase from '../Firebase';
import React from 'react';
import {connect} from 'react-redux';
import { Form, Text } from 'react-form';
import {LOG_IN_VIEW, SIGN_UP_VIEW, VERIFY_VIEW, HOME_SCREEN} from '../constants/Views';
import {changeView, loadAndSetUserDetails} from '../actions/actions';
import '../styles/CardStyles.css';

class SmartVerifyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.sendEmail = this.sendEmail.bind(this);
    this.verify = this.verify.bind(this);
    this.logout = this.logout.bind(this);
  }
  async sendEmail() {
    this.setState({
      loading:true,
    });
    let currUser = await Firebase.auth().currentUser;
    let displayMessage = '';
    if (!currUser.displayName)
      displayMessage = "We just sent you an email!";
    else
      displayMessage = currUser.displayName + ", we just sent you an email!";
    currUser.sendEmailVerification().then(() => {
      alert(displayMessage);
    }).catch((error)=>{
      alert("Oops, there was an error sending you an email: "+error.message);
    })
    this.setState({
      loading: false
    });
  }
  async verify() {
    this.setState({ loading: true });
    let currUser = await Firebase.auth().currentUser;
    currUser.reload().then(()=>{
      if (currUser.emailVerified) {
        this.setState({ loading: false });
        this.props.dispatch(loadAndSetUserDetails(currUser.uid)).then(()=>{
          this.props.dispatch(changeView(HOME_SCREEN));
        })
      }
      else {
        this.setState({ loading: false });
        alert("Seems like you aren't verified yet! Please try again.");
      }
    });
  }
  logout() {
    Firebase.auth().signOut().then(()=> {
      this.props.dispatch(changeView(LOG_IN_VIEW));
    }).catch((error) => {
      console.log("Could not sign user out:", error.message);
    });
  }
  render() {
    const cardsBackgroundImg = require('../icons/cardsbackground.jpg');
    return (
      <div
        style={{
          backgroundImage: `url(${cardsBackgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: "100%",
          position: 'absolute',
        }}
      >
        <div
          className="loginscreenTitleFont"
          style={{
            position: 'absolute',
            top: '30%',
            width: '100%',
          }}
        >
          Bridge Buddies
        </div>
        <div>
          {'Click "Verify" once you have verified your account from your email.'}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '40%',
            top: '45%',
          }}
        >
          <button
            onClick={this.sendEmail}
          >
            Resend email
          </button>
          <button
            onClick={this.verify}
          >
            Verify
          </button>
          <button
            onClick={this.logout}
          >
            Log out
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentView: state.ui.currentView,
  }
};

export default connect(mapStateToProps)(SmartVerifyPage);
