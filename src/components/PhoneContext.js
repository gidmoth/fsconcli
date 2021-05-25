/**
 * provide phone
 */

import { UserAgent, Registerer, Inviter, SessionState } from 'sip.js'
import { createContext, useState, useRef, useReducer } from 'react'

function reducer(currstate, event) {
    switch (event.type) {
        case 'register': {
            return { ...currstate, registered: true }
        }
        case 'ring': {
            return { ...currstate, ringing: true, pop: true }
        }
        case 'popped': {
            return { ...currstate, pop: false }
        }
        case 'call': {
            return { ...currstate, calling: true }
        }
    }
}

// get context  object
const PhoneContext = createContext()

// construct provider
function PhoneProvider(props) {

    // ref for Phone
    const phoneRef = useRef()
    const sessionRef = useRef()
    const streamRef = useRef()

    // states
    /* const [registered, setRegistered] = useState(false)
    const [ringing,  setRinging]  = useState(false) */

    const [phonestate, dispatch] = useReducer(reducer, {
        registered: false,
        ringing: false,
        pop: false,
        calling: false
    })

    //  connect media
    function setupRemoteMedia(session, element) {
        session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
            if (receiver.track) {
                streamRef.current.addTrack(receiver.track);
            }
        });
        element.srcObject = streamRef.current;
        element.play();
    }

    // cleanup mediastream
    function cleanupMedia(element) {
        element.srcObject = null;
        element.pause();
    }

    // function to make call
    function makeCall(element) {
        const target = UserAgent.makeURI('sip:32000@gsphone.c8h10n4o2.gs:3361')
        const inviter = new Inviter(phoneRef.current, target)
        sessionRef.current = inviter
        sessionRef.current.stateChange.addListener((state) => {
            console.log(`Session state changed to ${state}`);
            switch (state) {
                case SessionState.Initial:
                    break;
                case SessionState.Establishing:
                    break;
                case SessionState.Established:
                    setupRemoteMedia(inviter, element);
                    break;
                case SessionState.Terminating:
                // fall through
                case SessionState.Terminated:
                    cleanupMedia(element);
                    break;
                default:
                    throw new Error("Unknown session state.");
            }
        })

        const inviteOptions = {
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: true,
                    video: false,
                },
            }
        }

        sessionRef.current.invite(inviteOptions)
            .then(() => {
                dispatch({ type: 'call' })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // function to accept call
    function answerCall() {
        sessionRef.current.accept()
            .then(() => {
                console.log('ACCEPTED INVITE')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function endCall() {
        console.log(sessionRef.current.state)
        switch (sessionRef.current.state) {
            case SessionState.Initial:
            case SessionState.Establishing:
                if (sessionRef.current instanceof Inviter) {
                    // An unestablished outgoing session
                    sessionRef.current.cancel();
                } else {
                    // An unestablished incoming session
                    sessionRef.current.reject();
                }
                break;
            case SessionState.Established:
                // An established session
                sessionRef.current.bye();
                break;
            case SessionState.Terminating:
            case SessionState.Terminated:
                // Cannot terminate a session that is already terminated
                break;
        }
    }

    //  function to register Phone
    function initPhone(user, apiorigin, element) {

        // configure useragent
        const transportOptions = {
            server: `wss://${apiorigin.split('//')[1]}${user.wss_binding}`
        }

        //  connect media
        streamRef.current = new MediaStream()

        // delegate call receiving
        function onInvite(invitation) {
            console.log(invitation.remoteIdentity._displayName)
            dispatch({ type: 'ring' })
            sessionRef.current = invitation
            sessionRef.current.stateChange.addListener((state) => {
                console.log(`Session state changed to ${state}`)
                switch (state) {
                    case SessionState.Initial:
                        break;
                    case SessionState.Establishing:
                        break;
                    case SessionState.Established:
                        setupRemoteMedia(sessionRef.current, element);
                        break;
                    case SessionState.Terminating:
                    // fall through
                    case SessionState.Terminated:
                        cleanupMedia(element);
                        break;
                    default:
                        throw new Error("Unknown session state.")
                }
            })
        }


        const uri = UserAgent.makeURI(`sip:${user.id}@${apiorigin.split('//')[1]}:${user.internal_tls_port}`)
        const userAgentOptions = {
            authorizationUsername: `${user.id}`,
            authorizationPassword: `${user.password}`,
            displayName: `${user.name}`,
            contactName: `${user.name}`,
            delegate: {
                onInvite
            },
            transportOptions,
            uri
        }

        // create useragent
        phoneRef.current = new UserAgent(userAgentOptions)

        // create registerer
        const registerer = new Registerer(phoneRef.current)

        //  start and register
        phoneRef.current.start()
            .then(() => {
                registerer.register()
                    .then(() => {
                        console.log('PHONE REGISTERED')
                        dispatch({ type: 'register' })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // things to get used by components
    const value = {
        initPhone: initPhone,
        phonestate: phonestate,
        phonedispatch: dispatch,
        answerCall: answerCall,
        makeCall: makeCall,
        endCall: endCall
    }

    return (
        <PhoneContext.Provider value={value}>
            {props.children}
        </PhoneContext.Provider>
    )
}

// export what is needed
export { PhoneContext, PhoneProvider }
