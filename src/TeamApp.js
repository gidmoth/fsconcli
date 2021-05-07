/**
 * main component for team-context users
 */

import { useState, useEffect } from 'react';
import UsersPage from './components/team/UsersPage';
import StartPage from './components/team/StartPage'

function TeamApp(props) {

  // get control states and setters
  const [mode, setMode] = useState('startpage')
  const [initXml, setInitXml] = useState(true)
  const [xmlState, setXmlState] = useState()

  // effects on states
  useEffect(() => {
    if (initXml) {
      fetch(`${props.apiorigin}/api/info/state`, {
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

  // xmlchange handler
  function handleXmlChange() {
    setInitXml(true)
  }

  // render according to mode
  switch (mode) {
    case 'startpage': {
      return (
        <>
          <header className="App-header">
            <p>
              {`fsconcli on ${window.location.origin}`}
            </p>
          </header>
          {globals && <StartPage
            users={users}
            globals={globals}
            conferences={conferences}
            conferencetypes={conferencetypes}
            info={info}
            user={props.user}
          />}
          <button onClick={handleXmlChange}>reset initXml</button>
        </>
      );
    }
    case 'userpage': {
      return (
        <>
          <header className="App-header">
            <p>
              {`fsconcli on ${window.location.origin}`}
            </p>
          </header>
          {users && <UsersPage
            users={users}
            user={props.user}
          />}
          <button onClick={handleXmlChange}>reset initXml</button>
        </>
      );
    }
    default: {
      return null
    }
  }
}

export default TeamApp;
