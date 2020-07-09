import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCbDmVfxrzY2JGXcD4g5p39b4vvG3QN34c",
  authDomain: "ninja-smoothies-4dc06.firebaseapp.com",
  databaseURL: "https://ninja-smoothies-4dc06.firebaseio.com",
  projectId: "ninja-smoothies-4dc06",
  storageBucket: "ninja-smoothies-4dc06.appspot.com",
  messagingSenderId: "931422934476",
  appId: "1:931422934476:web:bccb47333e6ac0aac3b969",
  measurementId: "G-SC6V9GKRNS"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.firestore().settings({ timestampsInSnapshots: true })
firebase.analytics();

//export firestore db
export default firebaseApp.firestore()