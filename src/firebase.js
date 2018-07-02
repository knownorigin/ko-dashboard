import firebase from 'firebase';
import 'firebase/firestore';
import config from './config'

// Initialize Firebase
firebase.initializeApp(config);

firebase.firestore().settings({timestampsInSnapshots: true});

export const db = firebase.firestore();
