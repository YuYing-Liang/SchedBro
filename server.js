const express = require('express');
const firebase = require('firebase');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

var firebaseConfig = {
    apiKey: process.env.fb_apiKey || require ('./config/dev.json').apiKey,
    authDomain: process.env.fb_authDomain ||  require ('./config/dev.json').authDomain,
    databaseURL: process.env.fb_databaseURL || require ('./config/dev.json').databaseURL,
    projectId: process.env.fb_projectId || require ('./config/dev.json').projectId,
    storageBucket: process.env.fb_storageBucket || require ('./config/dev.json').storageBucket,
    messagingSenderId: process.env.fb_messagingSenderId || require ('./config/dev.json').messagingSenderId,
    appId: process.env.fb_appId || require ('./config/dev.json').appId,
    measurementId: process.env.fb_measurementId || require ('./config/dev.json').measurementId
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT || 5000, () => {
	console.log('SchedBro listening for youuuu');
});