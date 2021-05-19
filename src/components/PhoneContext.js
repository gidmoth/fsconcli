/**
 * provide phone
 */

import { Web as Phone } from 'sip.js'
import { createContext, useState, useRef, useEffect } from 'react'
import PhoneAudio from './PhoneAudio'

// get context  object
const PhoneContext = createContext()

// construct provider
function PhoneProvider(props) {

    // ref for audio element and Phone
    const audioRef = useRef()
    const phoneRef = useRef()

    // states

    // destruct props
    const { user, apiorigin } = props

    const  phoneelem = <PhoneAudio ref={audioRef} />

    //  Effect to register Phone
    useEffect(() => {
            (async () => {
                const server = `wss://${apiorigin.split('//')[1]}${user.wss_binding}`
                const aor = `sip:${user.id}@${apiorigin.split('//')[1]}:${user.internal_tls_port}`
                const authorizationUsername = `${user.id}`
                const authorizationPassword = `${user.password}`

                //  Phone options
                const options = {
                    aor,
                    media: {
                        remote: {
                            audio: audioRef.current
                        }
                    },
                    userAgentOptions: {
                        authorizationPassword,
                        authorizationUsername,
                    }
                }

                console.log(`MY AUDIOELEMENT: ${audioRef.current}`)

                // sip.js simpleuser
                phoneRef.current = new Phone.SimpleUser(server, options)

                // delegate for inbound calls
                phoneRef.current.delegate = {
                    onCallReceived: async () => {
                        await phoneRef.current.answer()
                    }
                }

                // connect
                await phoneRef.current.connect()

                // register
                await phoneRef.current.register()

                console.log(`PHONEi REGISTEED: ${phoneRef.current}`)
            })()
    }, [])

    // things to get used by components
    const value = {
        audioelem: phoneelem,
        phone: phoneRef.current
    }

    return (
        <PhoneContext.Provider value={value}>
            {props.children}
        </PhoneContext.Provider>
    )
}

// export what is needed
export { PhoneContext, PhoneProvider }
