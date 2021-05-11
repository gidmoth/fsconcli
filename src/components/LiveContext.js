/**
 * context to share lifestate
 */

import { createContext, useReducer } from 'react'

// reducer for stateupdating
function reducer(currstate, event) {
    return [...currstate].push(event)
}

// get context  object
const LiveContext = createContext()

// construct provider
function LiveProvider(props) {

    //  get a state for xmlstate
    const [liveState, dispatch] = useReducer(reducer, [])

    // things to get used by components
    const value = {
        liveState: liveState,
        dispatch: dispatch
    }

    return (
        <LiveContext.Provider value={value}>
            {props.children}
        </LiveContext.Provider>
    )
}

// export what is needed
export { LiveContext, LiveProvider }

