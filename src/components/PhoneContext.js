/**
 * provide phone
 */

import { Web as Phone } from 'sip.js'
import { createContext, useState, useRef } from 'react'

// get context  object
const PhoneContext = createContext()

// construct provider
function PhoneProvider(props) {

    // ref for Phone
    const phoneRef = useRef()

    // states

    //  function to register Phone
    async function initPhone(user, apiorigin, element) {
        const server = `wss://${apiorigin.split('//')[1]}${user.wss_binding}`
        const aor = `sip:${user.id}@${apiorigin.split('//')[1]}:${user.internal_tls_port}`
        const authorizationUsername = `${user.id}`
        const authorizationPassword = `${user.password}`

        //  Phone options
        const options = {
            aor,
            media: {
                remote: {
                    audio: element
                }
            },
            userAgentOptions: {
                authorizationPassword,
                authorizationUsername,
            }
        }

        console.log(`MY AUDIOELEMENT: ${element}`)

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

        console.log(`PHONE REGISTEED: ${phoneRef.current}`)
    }

    // things to get used by components
    const value = {
        phone: phoneRef.current,
        initPhone: initPhone
    }

    return (
        <PhoneContext.Provider value={value}>
            {props.children}
        </PhoneContext.Provider>
    )
}

// export what is needed
export { PhoneContext, PhoneProvider }
