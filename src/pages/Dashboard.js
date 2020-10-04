import React, { useEffect, useState } from 'react'
import Popup from '../components/Popup';
import Schedule from '../components/Schedule';
import firebase from '../firebase'
import prompts from '../util/prompt_questions.json'

const database = firebase.database();
const admin = firebase.auth();
export default function Dashboard(props) {
    let [user, setUser] = useState(null)
    let [state, setState] = useState({})
    let [display, setDisplay] = useState('none')
    
    useEffect(() => {
        async function getSettings(u) {
            let settings = await database.ref('users/' + u.uid + '/settings').once('value')
            if(!settings.exists()) {
                setDisplay('block')
            }else{
                // await getEvents(u)
            }
        }
        let user = admin.currentUser
        console.log(user)
        if (!user) {
            alert("please login to view your calendar")
            props.history.push("/")
        } else {
            setUser(user)
            getSettings(user)
        }
    }, []);

    function updateState(e) {
        let temp = state
        temp[e.target.name] = e.target.value
        setState(temp)
    }

    function setSettings(e){
        console.log(state)
        if(!state.start_time || !state.end_time || !state.break_time){
            alert("please enter in all settings")
            return;
        }
        database.ref('users/' + user.uid).update({
            settings: state
        }).then((res) => {
            setState(null)
            setDisplay('none')
            // getEvents(user)
            alert("Thank you! You can start planning now!")
        })
    }

    return (
        <div>
            <form className="popup" style={{display: display}}>
                <h4>Let's understand how you go about your day ...</h4>
                <Popup fields={prompts.time_bounds} onChange={updateState}/>
                <Popup fields={prompts.break_time}  onChange={updateState}/>
                <input type="button" onClick={setSettings} value="Set!"/>
            </form>
            {user &&
                <div>
                    <h2>Hi {user.displayName}</h2>
                    <p>Let's plan your day today!</p>
                    <p>email: {user.email}</p>
                    <button onClick={() => {props.calendar.logout()}}> Sign Out </button> 
                    <Schedule user={user} calendar={props.calendar}/>
                </div>
            }
        </div>
    )
}