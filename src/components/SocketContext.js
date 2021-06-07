/**
 * provide socket and nothing else
 */

import { createContext, useRef } from 'react'

// get context  object
const SocketContext = createContext()

// construct provider
function SocketProvider(props) {

    // ref for socket
    const socketRef = useRef(null)

    //  get a state for xmlstate
    //const [socket, setSocket] = useState()

    function initsocket(url) {
        socketRef.current = new WebSocket(`${url}`)
    }

    function sendreq(req) {
        socketRef.current.send(JSON.stringify(req))
    }

    // things to get used by components
    const value = {
        socket: socketRef,
        initsocket: initsocket,
        sendreq: sendreq
    }

    return (
        <SocketContext.Provider value={value}>
            {props.children}
        </SocketContext.Provider>
    )
}

// export what is needed
export { SocketContext, SocketProvider }
