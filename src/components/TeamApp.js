/**
 * main component for team-context users
 */

import { useState, useEffect, useContext } from 'react';
import Info from './team/Info'
import Monitor from './team/Monitor'
import AppHeader from './AppHeader'
import useGetXmlState from './team/useGetXmlState'
//import useInitSocket from './team/useInitSocket'
import { XmlContext } from './XmlContext'
import { SocketContext } from './SocketContext'
import { LiveContext } from './LiveContext'

function TeamApp(props) {

  // get control states and setters
  const [mode, setMode] = useState('info')

  // get contexts
  const { newxml } = useContext(XmlContext)
  const { initsocket, socket, sendreq } = useContext(SocketContext)
  const { dispatcher } = useContext(LiveContext)

  // get xmlState
  const {
    loading,
    handleXmlChange
  } = useGetXmlState(props.apiorigin, newxml)

  // init socket
  /* const {
    sockReady
  } = useInitSocket(props.user, props.apiorigin, initsocket, socket, dispatcher) */

  //  init Livestate
  useEffect(() => {
    if (!socket.current) {
      console.log(`NO  SOCKET!!`)
      const { password, name } = props.user
      const urlbase = `wss://${props.apiorigin.split('//')[1]}`
      initsocket(`${urlbase}/api/live?login=${name}:${password}`)
    }
  }, [socket])

  useEffect(() => {
    if (socket.current) {
      console.log(`GOT SOCKET!!`)
      socket.current.onmessage = function (evn) {
        dispatcher(JSON.parse(evn.data))
      }
      socket.current.onopen = function (evn) {
        sendreq({ req: 'init' })
        sendreq({ req: 'initreg' })
      }
      console.log('listener setup!')
      console.log(socket.current)
      //sendreq({req: 'init'})
      //sendreq({req: 'initreg'})
      return () => {
        socket.current.close()
        socket.current = null
        console.log('socket closed')
      }
    }
  }, [socket])

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
        user={props.user}
      />
      { mode === 'info' ? <Info /> : <Monitor />}
      {loading && <p>Loading...</p>}
      {!socket && <p>Initializing socket...</p>}
    </>
  );
}

export default TeamApp;
