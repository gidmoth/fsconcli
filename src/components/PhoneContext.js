/**
 * provide phone
 */

import { Web as Phone } from 'sip.js'
import { createContext, useState, useRef } from 'react'
import  PhoneAudio from './PhoneAudio'

// get context  object
const PhoneContext = createContext()

// construct provider
function PhoneProvider(props) {

    // ref for audio element
    const audioRef = useRef()

    // destruct props
    const { user, apiorigin } = props

    // create phoneelement
    const phoneelement = <PhoneAudio ref={audioRef} />

    // things to get used by components
    const value = {
        audioelem: phoneelement
    }

    return (
        <PhoneContext.Provider value={value}>
            {props.children}
        </PhoneContext.Provider>
    )
}

// export what is needed
export { PhoneContext, PhoneProvider }
