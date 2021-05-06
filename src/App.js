/**
 * main component
 */

import './App.css';
import { useState, useEffect } from 'react';
import UserList from './components/UserList';

function App(props) {

  // get control states and setters
  const [mode, setMode] = useState('startpage')
  const [initXml, setInitXml] = useState(true)
  const [xmlState, setXmlState] = useState()

  // effects on states
  useEffect(() => {
    if (initXml) {
      fetch('https://gsphone.c8h10n4o2.gs/api/info/state', {
        method: 'GET',
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setXmlState(data)
          setInitXml(false)
        })
    }
  }, [initXml])

  // variables for xmlState destructuring
  let info, globals, users, conferencetypes, conferences

  // conditional xmlState destructuring
  if (xmlState) {
    ({ info, globals, users, conferencetypes, conferences } = xmlState.state)
  }

  // checkbutton handler
  function handleCheckButton() {
    setInitXml(true)
  }

  // render according to state
  switch  (mode) {
    case 'startpage': {
      return (
        <div className="App">
          <header className="App-header">
            <p>
              {`fsconcli on ${window.location.origin}`}
            </p>
          </header>
          {users && <UserList list={users} />}
          <button onClick={handleCheckButton}>reset initXml</button>
        </div>
      );
    }
    default: {
      return null
    }
  }
}

export default App;
