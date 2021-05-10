/**
 * main component for team-context users
 */

import { useState, useEffect } from 'react';
import Info from './team/Info'
import AppHeader from './AppHeader'
import useGetXmlState from './team/useGetXmlState'

function TeamApp(props) {

  // get control states and setters
  const [mode, setMode] = useState('info')

  // get xmlState
  const {
    loading,
    info,
    globals,
    users,
    conferencetypes,
    conferences,
    handleXmlChange
  } = useGetXmlState(props.apiorigin)

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
          {loading && <p>Loading...</p>}
          <button onClick={handleXmlChange} disabled={loading}>reset initXml</button>
        </>
      );
    }
    default: {
      return null
    }
  }
}

export default TeamApp;
