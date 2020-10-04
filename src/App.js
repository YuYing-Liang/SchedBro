import React, { useEffect } from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import Login from './pages/Login'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import CalendarFunctions from './components/CalendarFncs'

let cal = new CalendarFunctions()
export default function App() {

  useEffect(() => {
    cal.initClient()
  }, [])

  return (
    <BrowserRouter>
      <div className="container-body">
        <Switch>
          <Route path="/" exact component={(props) => <Login {...props} calendar={cal} />} />
          <Route path="/dashboard" exact component={(props) => <Dashboard {...props} calendar={cal} />} />
        </Switch>
      </div>
      {/* <Footer/> */}
    </BrowserRouter>
  );
}
