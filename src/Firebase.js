import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBtPhuTLI8kbQ-6fn14tr4C4Cm6IDyZFPQ",
    authDomain: "bridge-buddies.firebaseapp.com",
    databaseURL: "https://bridge-buddies.firebaseio.com",
    projectId: "bridge-buddies",
    storageBucket: "bridge-buddies.appspot.com",
    messagingSenderId: "560205523041"
  };
const Firebase = firebase.initializeApp(config);
export default Firebase;
