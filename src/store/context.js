import React from 'react'
import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyAUlqVFqNfKTY34UCA0_jt9kHlTqMgDzi0",
  authDomain: "ar-classroom-1bb48.firebaseapp.com",
  projectId: "ar-classroom-1bb48",
  storageBucket: "ar-classroom-1bb48.appspot.com",
  messagingSenderId: "801778279327",
  appId: "1:801778279327:web:e63f67b115057a5e2c53aa",
  measurementId: "G-DEC44C4SPG"
};
firebase.initializeApp(firebaseConfig);

const StoreContext = React.createContext(firebase.firestore());
export const StoreProvider = StoreContext.Provider
export default StoreContext
