/**
 * provide socket and nothing else
 */

 import { createContext, useState } from 'react'

 // get context  object
 const SocketContext = createContext()
 
 // construct provider
 function SocketProvider(props) {
 
     //  get a state for xmlstate
     const [socket, setSocket] = useState()

     function initsocket(sock) {
         setSocket(sock)
     }
 
     // things to get used by components
     const value = {
         socket: socket,
         initsocket: initsocket
     }
 
     return (
         <SocketContext.Provider value={value}>
             {props.children}
         </SocketContext.Provider>
     )
 }
 
 // export what is needed
 export { SocketContext, SocketProvider }
  