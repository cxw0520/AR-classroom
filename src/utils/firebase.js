import firebase from 'firebase/compat/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAUlqVFqNfKTY34UCA0_jt9kHlTqMgDzi0",
    authDomain: "ar-classroom-1bb48.firebaseapp.com",
    projectId: "ar-classroom-1bb48",
    storageBucket: "ar-classroom-1bb48.appspot.com",
    messagingSenderId: "801778279327",
    appId: "1:801778279327:web:e63f67b115057a5e2c53aa",
    measurementId: "G-DEC44C4SPG"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    // firebase.firestore.setLogLevel('debug');
  }


export default firebase;