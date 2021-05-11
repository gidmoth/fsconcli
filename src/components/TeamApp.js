/**
 * main component for team-context users
 */

import { useState, useEffect, useContext } from 'react';
import Info from './team/Info'
import Monitor from './team/Monitor'
import AppHeader from './AppHeader'
import useGetXmlState from './team/useGetXmlState'
import { XmlContext } from './XmlContext'
import { SocketContext } from './SocketContext'

function TeamApp(props) {

  // get control states and setters
  const [mode, setMode] = useState('monitor')

  // get contexts
  const { newxml } = useContext(XmlContext)
  const { initsocket, socket } = useContext(SocketContext)

  // get xmlState
  const {
    loading,
    handleXmlChange
  } = useGetXmlState(props.apiorigin, newxml)

  // create socket connection
  useEffect(() => {
    const { password, name } = props.user
    const urlbase = `wss://${props.apiorigin.split('//')[1]}`
    initsocket(new WebSocket(`${urlbase}/api/live?login=${name}:${password}`))
    console.log('socket initialized')
    return () => {
      socket.close()
      console.log('socket closed')
    }
  }, [])

  // connect to socket depending on user
  /* const { password, name } = props.user
  const urlbase = `wss://${props.apiorigin.split('//')[1]}`
  console.log(urlbase)

  const livesock = new WebSocket(`${urlbase}/api/live?login=${name}:${password}`)
  console.log(livesock) */

  // render according to mode
  switch (mode) {
    case 'info': {
      return (
        <>
          <AppHeader />
          <Info />
          {loading && <p>Loading...</p>}
          <button onClick={handleXmlChange} disabled={loading}>reset initXml</button>
        </>
      );
    }
    case 'monitor': {
      return (
        <>
          <AppHeader />
          <Monitor />
        </>
      )
    }
    default: {
      return null
    }
  }
}

export default TeamApp;
