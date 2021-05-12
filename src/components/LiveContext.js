/**
 * context to share lifestate
 */

import { createContext, useReducer } from 'react'

// reducer for stateupdating
function reducer(currstate, event) {
    const newstate = { ...currstate }
    const newconfs = [...newstate.conferences]
    const newregs =  [...newstate.registrations]
    newconfs.push(event)
    console.log(`reducerevent: ${JSON.stringify(event)}`)
    newstate.conferences = newconfs
    newstate.registrations =  newregs
    console.log(`currstate: ${JSON.stringify(currstate)}`)
    console.log(`reducedstate: ${JSON.stringify(newstate)}`)
    return newstate
}

// get context  object
const LiveContext = createContext()

// construct provider
function LiveProvider(props) {

    //  get a state for xmlstate
    const [liveState, dispatch] = useReducer(reducer, {
        conferences: [],
        registrations: []
    })

    // things to get used by components
    const value = {
        liveState: liveState,
        dispatcher: dispatch
    }

    return (
        <LiveContext.Provider value={value}>
            {props.children}
        </LiveContext.Provider>
    )
}

// export what is needed
export { LiveContext, LiveProvider }

