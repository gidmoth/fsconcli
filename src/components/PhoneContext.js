/**
 * provide phone
 */

import { Web as Phone } from 'sip.js'
import { createContext, useState } from 'react'

// get context  object
const PhoneContext = createContext()

// construct provider
function PhoneProvider(props) {

    // destruct props
    const { user } = props

    

    // things to get used by components
    const value = {}

    return (
        <PhoneContext.Provider value={value}>
            {props.children}
        </PhoneContext.Provider>
    )
}

// export what is needed
export { PhoneContext, PhoneProvider }
