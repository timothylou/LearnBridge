import Firebase from '../Firebase';
import React from 'react';
import {connect} from 'react-redux';
import { Form, Text } from 'react-form';
import {LOG_IN_VIEW, SIGN_UP_VIEW, VERIFY_VIEW} from '../constants/Views';
import {changeView, logIn} from '../actions/actions';
import '../styles/CardStyles.css';

class SmartSignupPage extends React.Component {
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
    this.signup = this.signup.bind(this);
  }
  validate(values) {
    const { firstName, lastName, email, password } = values;
    return {
      firstName: (!firstName) ? 'Your first name is required' : undefined,
      lastName: (!lastName) ? 'Your last name is required' : undefined,
      email: (!email) ? 'An email is required' : undefined,
      password: (password && password.length < 6) ?
      'Your password must be at least 6 characters long' : undefined,
    }
  }
  onSubmit(values) {
    console.log('Submitted signup values:', values);
    this.signup(values.firstName, values.lastName, values.email, values.password);
  }
  signup(fname, lname, email, password) {
    this.setState({loading: true});
    if (!(/\S/.test(fname) && fname)) {
      alert("Please enter a valid first name!")
      this.setState({loading: false});
    }
    else if (!(/\S/.test(lname) && lname)) {
      alert("Please enter a valid last name!")
      this.setState({loading: false});
    }
    else {
      Firebase.auth().createUserWithEmailAndPassword(email, password
      ).then((userData) => {
        userData.updateProfile({
          displayName: fname + ' ' + lname[0].toUpperCase(),
          email: email,
        }).then(()=>{
        }).catch((error)=>{
          console.log("Firebase updateProfile error:", error.message);
        });
        this.props.dispatch(logIn(userData.uid));
        const userDatabaseDetailsPath = '/users/' + userData.uid + '/details';
        Firebase.database().ref(userDatabaseDetailsPath).set({
          fname: fname,
          lname: lname,
          uid: userData.uid,
        }).catch((error) => {
          console.log('Firebase userDatabaseDetails post failed:', error.message);
        });

        const userDatabaseGameDataPath = '/users/' + userData.uid + '/gamedata';
        Firebase.database().ref(userDatabaseGameDataPath).set({
          numCoins: 0,
          level: 1,
          exp: 0,
          cardbacks: 0, // will be converted into list once items are bought
          characters: 0, // same as above
          activeCardback: "Blue",
          activeCharacter: "1",
        }).catch((error) => {
          console.log('Firebase userDatabaseGameData post failed:', error.message);
        });

        Firebase.auth().signInWithEmailAndPassword(email, password
        ).then((userData) => {
          this.setState({loading: false});
          userData.sendEmailVerification().then(()=>{
            alert("Your account was created. Welcome to Bridge Buddies! Check your email to verify your account.")
          }).catch((error)=> {
            console.log('Firebase sendEmailVerification failed:', error.message);
          });
          this.props.dispatch(changeView(VERIFY_VIEW));
        }).catch((error)=>{
          this.setState({loading: false});
          console.log('Firebase signInWithEmailAndPassword failed:', error.message);
        });
      }).catch((error)=>{
        this.setState({loading: false});
        alert("Oops, we couldn\'t create your account: " + error.message);
      });
    }
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
                    <h4>First name</h4>
                    <Text
                      field='firstName'
                      placeholder='Your first name'
                    />
                  </div>
                  <div>
                    <h4>Last name</h4>
                    <Text
                      field='lastName'
                      placeholder='Your last name'
                    />
                  </div>
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
                  <button type='submit'>Sign up</button>
                </form>
              )
            }}
          </Form>
          <button
            onClick={()=>this.props.dispatch(changeView(LOG_IN_VIEW))}
          >
            Have an account? Click to log in!
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
export default connect(mapStateToProps)(SmartSignupPage);
