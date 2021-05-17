/**
 * main component for team-context users
 */

import { useState, useEffect, useContext } from 'react';
import Info from './team/Info'
import Monitor from './team/Monitor'
import AppHeader from './AppHeader'
import useGetXmlState from './team/useGetXmlState'
import useInitSocket from './team/useInitSocket'
import { XmlContext } from './XmlContext'
import { SocketContext } from './SocketContext'
import { LiveContext } from './LiveContext'

function TeamApp(props) {

  // get control states and setters
  const [mode, setMode] = useState('info')

  // get contexts
  const { newxml } = useContext(XmlContext)
  const { initsocket, socket } = useContext(SocketContext)
  const { dispatcher } = useContext(LiveContext)

  // get xmlState
  const {
    loading,
    handleXmlChange
  } = useGetXmlState(props.apiorigin, newxml)

  // init socket
  const {
    sockReady
  } = useInitSocket(props.user, props.apiorigin, initsocket, socket, dispatcher)

  // to pass down
  function switchMode(newmode) {
    setMode(newmode)
  }

  // render according to mode
  return (
    <>
      <AppHeader
        switchMode={switchMode}
        apiorigin={props.apiorigin}
        mode={mode}
      />
      { mode === 'info' ? <Info /> : <Monitor />}
      {loading && <p>Loading...</p>}
      {!sockReady && <p>Initializing socket...</p>}
    </>
  );
}

export default TeamApp;
