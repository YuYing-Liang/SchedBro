import firebase from '../firebase'

const database = firebase.database()
const admin = firebase.auth()
let gapi = window.gapi

export default class CalendarFunctions {
    constructor() {
        this.initClient = this.initClient.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.getCalendar = this.getCalendar.bind(this);
    }

    initClient() {
        const CLIENT_ID = process.env.CLIENT_ID || require ('../config/dev.json').CLIENT_ID
        const API_KEY = process.env.API_KEY || require ('../config/dev.json').API_KEY
        const DISCOVERY_DOCS = process.env.DISCOVERY_DOCS || require ('../config/dev.json').DISCOVERY_DOCS
        const SCOPES = process.env.SCOPES || require ('../config/dev.json').SCOPES
        gapi.load('client', async () => {
            console.log('loaded client')

            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })

            gapi.client.load('calendar', 'v3', () => console.log('calendar uploaded!'))
        });
    }

    async logout() {
        const googleAuth = gapi.auth2.getAuthInstance()
        const googleUser = await googleAuth.signOut();
        admin.signOut();
    }

    async login() {
        try {
            const googleAuth = gapi.auth2.getAuthInstance()
            const googleUser = await googleAuth.signIn();
            const token = googleUser.getAuthResponse().id_token;

            console.log(googleUser)

            const credential = firebase.auth.GoogleAuthProvider.credential(token);
            let res = await admin.signInWithCredential(credential);

            let acct = await database.ref('users/' + res.user.uid).once('value');
            if (!acct.exists()) {
                database.ref('users/' + res.user.uid).update({
                    email: res.user.email,
                    name: res.user.displayName
                })
            }
            console.log(res)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async getCalendar() {
        let today = new Date();
        let nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        const events = await gapi.client.calendar.events.list({
            calendarId: 'lqal4od589o2o591n5mlessqi0@group.calendar.google.com',
            timeMin: today.toISOString(),
            timeMax: nextWeek.toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime'
        })
        const personal = await gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: today.toISOString(),
            timeMax: nextWeek.toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime'
        })

        console.log(events.result.items)
        console.log(personal.result.items)
        const allEvents = {
            school: events.result.items,
            personal: personal.result.items
        }
        console.log("all events", allEvents)
        return allEvents;
    }
}
