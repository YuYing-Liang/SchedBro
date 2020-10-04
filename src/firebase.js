import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const config = {
    apiKey: process.env.fb_apiKey || require ('./config/dev.json').apiKey,
    authDomain: process.env.fb_authDomain ||  require ('./config/dev.json').authDomain,
    databaseURL: process.env.fb_databaseURL || require ('./config/dev.json').databaseURL,
    projectId: process.env.fb_projectId || require ('./config/dev.json').projectId,
    storageBucket: process.env.fb_storageBucket || require ('./config/dev.json').storageBucket,
    messagingSenderId: process.env.fb_messagingSenderId || require ('./config/dev.json').messagingSenderId,
    appId: process.env.fb_appId || require ('./config/dev.json').appId,
    measurementId: process.env.fb_measurementId || require ('./config/dev.json').measurementId
};

if(!firebase.apps.length){
  firebase.initializeApp(config);
}

export default firebase;