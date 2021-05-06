/**
 * main component
 */

import './App.css';
import { useState, useEffect } from 'react';
import UserList from './components/UserList';

function App(props) {

  const [xmlState, setXmlState] = useState({
    "op": "info/state",
    "state": {
      "info": {},
      "globals": {},
      "users": [],
      "conferencetypes": [],
      "conferences": []
    }
  })

  useEffect(() => {
    fetch('https://gsphone.c8h10n4o2.gs/api/info/state', {
      method: 'GET',
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
  }, [])

  const {
    info,
    globals,
    users,
    conferencetypes,
    conferences
  } = xmlState.state

  

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {`fsconcli on ${window.location.origin}`}
        </p>
      </header>
      <UserList list={users} />
    </div>
  );
}

export default App;
