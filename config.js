import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyBuLyRnhX5PdLMid7Y-wfSdr6VbkoRj7vU",
  authDomain: "barter-app-132.firebaseapp.com",
  databaseURL: "https://barter-app-132.firebaseio.com",
  projectId: "barter-app-132",
  storageBucket: "barter-app-132.appspot.com",
  messagingSenderId: "148131387901",
  appId: "1:148131387901:web:8d0386460e38df729ea194"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
