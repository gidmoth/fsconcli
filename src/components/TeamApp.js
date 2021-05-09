/**
 * main component for team-context users
 */

import { useState, useEffect } from 'react';
import Info from './team/Info'
import AppHeader from './AppHeader'

function TeamApp(props) {

  // get control states and setters
  const [mode, setMode] = useState('info')
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
    case 'info': {
      return (
        <>
          <AppHeader />
          {globals && <Info
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
    default: {
      return null
    }
  }
}

export default TeamApp;
