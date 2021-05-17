/**
 * custom hook initialize socket
 */

import { useState, useEffect } from 'react'

function useInitSocket(user, apiorigin, initsocket, socket, dispatcher) {

    // get control state and setter
    const [sockReady, setSockReady] = useState(false)

    // effects on context and state
    useEffect(() => {
        if (!sockReady) {
            const { password, name } = user
            const urlbase = `wss://${apiorigin.split('//')[1]}`
            initsocket(new WebSocket(`${urlbase}/api/live?login=${name}:${password}`))
            console.log('socket initialized')
            setSockReady(true)
        }
    }, [apiorigin, initsocket, user, sockReady])

    useEffect(() => {
        if (sockReady) {
            socket.onmessage = function(evn) {
                dispatcher(JSON.parse(evn.data))
            }
            console.log('listener setup!')
            return () => {
                socket.close()
                console.log('socket closed')
            }
        }
    }, [sockReady, dispatcher, socket])

    // return for calling component
    return {sockReady}
}

export default useInitSocket