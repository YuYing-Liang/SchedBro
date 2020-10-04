import React, { useEffect, useState } from 'react'

export default function Login(props) {
    let [auth, setAuth] = useState({email: "", pwd: ""})

    useEffect(() => {
        console.log(props)
    }, [])
    function updateAuth(e) {
        let temp = auth;
        temp[e.target.name] = e.target.value
        setAuth(temp)
    }

    function loginWithGoogle() {
        let res = props.calendar.login()
        if(res){
            props.history.push('/dashboard')
        }
    }

    return (
        <div>
            <button onClick={loginWithGoogle}> Login With Google </button>
        </div>
    )
}