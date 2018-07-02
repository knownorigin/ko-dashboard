import firebase from 'firebase';
import 'firebase/firestore';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCfyAYzh4P9khRU13tEwxZh9NzC82h21fc',
  authDomain: 'known-origin-io.firebaseapp.com',
  databaseURL: 'https://known-origin-io.firebaseio.com',
  projectId: 'known-origin-io',
  storageBucket: 'known-origin-io.appspot.com',
  messagingSenderId: '927661982311'
};
firebase.initializeApp(config);

firebase.firestore().settings({timestampsInSnapshots: true});

export const db = firebase.firestore();
