import Firebase from '../Firebase';
import React from 'react';
import {connect} from 'react-redux';
import { Form, Text } from 'react-form';
import {changeView, logIn, loadAndSetUserDetails} from '../actions/actions';
import {LOG_IN_VIEW, SIGN_UP_VIEW, VERIFY_VIEW, HOME_SCREEN} from '../constants/Views';
import '../styles/CardStyles.css';

class SmartLoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
      // type:
    };
    //this.showHide = this.showHide.bind(this);
    this.validate = this.validate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.login = this.login.bind(this);
  }
  validate(values) {
    const { email, password } = values;
    return {
      email: (!email) ? 'Please enter your email' : undefined,
      password: (!password) ?
      'Please enter your password' : undefined,
    }
  }
  onSubmit(values) {
    console.log('Submitted login values:', values);
    this.login(values.email, values.password);
  }
  login(email, password) {
    this.setState({loading: true});
    Firebase.auth().signInWithEmailAndPassword(email.trim(), password
    ).then((userData) => {
      const currUser = userData;
      console.log(currUser);
      const userDatabasePath = '/users/' + currUser.uid + '/details';
      Firebase.database().ref(userDatabasePath).once('value').then((snapshot) =>{
        const fname = snapshot.val().fname;
        alert('Welcome back, '+fname+'!');
      }).catch((error)=>{
        console.log('Firebase getUserDatabaseDetails failed:', error.message);
      })
      currUser.reload().then();
      if (currUser.emailVerified) {
        this.setState({
          loading: false
        });
        this.props.dispatch(logIn(currUser.uid));
        this.props.dispatch(loadAndSetUserDetails(currUser.uid)).then(()=>{
          this.props.dispatch(changeView(HOME_SCREEN));
        })
      }
      else {
        this.setState({
          loading: false
        });
        this.props.dispatch(logIn(currUser.uid));
        this.props.dispatch(changeView(VERIFY_VIEW));
      }
    }).catch((error) => {
      this.setState({loading: false});
      const errorCode = error.code;
      const errorMsg = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      }
      else {
        alert(errorMsg);
      }
      console.log(error);
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
        <div
          style={{
            position: 'absolute',
            left: '40%',
            top: '45%',
          }}
        >
          <Form
            onSubmit={this.onSubmit}
            validate={this.validate}
          >
            {({submitForm}) => {
              return (
                <form onSubmit={submitForm}>
                  <div>
                    <h4>Email</h4>
                    <Text
                      field='email'
                      placeholder='Your email'
                    />
                  </div>
                  <div>
                    <h4>Password</h4>
                    <Text
                      field='password'
                      placeholder='Your password'
                      type='password'
                    />
                  </div>
                  <button type='submit'>Log in</button>
                </form>
              )
            }}
          </Form>
          <button
            onClick={()=>this.props.dispatch(changeView(SIGN_UP_VIEW))}
          >
            New here? Click to sign up!
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

export default connect(mapStateToProps)(SmartLoginPage);
