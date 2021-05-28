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
        case 'unregister': {
            return { ...currstate, registered: false }
        }
        case 'ring': {
            return { ...currstate, ringing: true, pop: true }
        }
        case 'popped': {
            return { ...currstate, pop: false }
        }
        case 'talk': {
            return { ...currstate, talking: true }
        }
        case 'unring': {
            return { ...currstate, ringing: false }
        }
        case 'endtalk': {
            return { ...currstate, talking: false }
        }
        case 'callanswered': {
            return { ...currstate, talking: true, calling: false }
        }
        case 'call': {
            return { ...currstate, calling: true }
        }
        case 'uncall': {
            return { ...currstate, calling: false }
        }
        case 'callaccept': {
            return { ...currstate, ringing: false, talking: true }
        }
        case 'togglevid': {
            return { ...currstate, video: !currstate.video }
        }
    }
}

// get context  object
const PhoneContext = createContext()

// construct provider
function PhoneProvider(props) {

    // ref for Phone
    const phoneRef = useRef(null)
    const sessionRef = useRef(null)
    const streamRef = useRef(null)
    const optstreamRef = useRef(null)
    const regRef = useRef(null)

    // states
    /* const [registered, setRegistered] = useState(false)
    const [ringing,  setRinging]  = useState(false) */

    const [phonestate, dispatch] = useReducer(reducer, {
        registered: false,
        ringing: false,
        pop: false,
        calling: false,
        video: false,
        talking: false
    })

    //  connect media
    function setupRemoteMedia(session, element, optelement) {
        session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
            if (receiver.track) {
                streamRef.current.addTrack(receiver.track);
            }
        });
        element.srcObject = streamRef.current;
        element.play()
        if (optelement) {
            session.sessionDescriptionHandler.peerConnection.getSenders().forEach((sender) => {
                if (sender.track) {
                    optstreamRef.current.addTrack(sender.track)
                }
            })
            optelement.srcObject = optstreamRef.current
            optelement.play()
        }
    }

    // cleanup mediastream
    function cleanupMedia(element, optelement) {
        element.srcObject = null;
        element.pause();
        if (optelement) {
            optelement.srcObject = null
            optelement.pause()
        }
    }

    // helper for videostate
    function getInviterOptions() {
        if (phonestate.video) {
            return {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: true,
                        video: true,
                    },
                }
            }
        }
        return {
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: true,
                    video: false,
                },
            }
        }
    }

    // function to make call
    function makeCall(element, optelement) {
        if (sessionRef.current) {
            console.log('CANT MAKE TWO CALLS!')
            return
        }
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
                    setupRemoteMedia(inviter, element, optelement);
                    dispatch({ type: 'callanswered' })
                    break;
                case SessionState.Terminating:
                // fall through
                case SessionState.Terminated:
                    sessionRef.current = null
                    cleanupMedia(element, optelement);
                    dispatch({ type: 'endtalk' })
                    break;
                default:
                    throw new Error("Unknown session state.");
            }
        })

        const inviteOptions = getInviterOptions()

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
        const acceptOptions = getInviterOptions()
        sessionRef.current.accept(acceptOptions)
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
                    sessionRef.current.cancel()
                    dispatch({ type: 'uncall' })
                } else {
                    // An unestablished incoming session
                    sessionRef.current.reject()
                    dispatch({ type: 'unring' })
                }
                break;
            case SessionState.Established:
                // An established session
                sessionRef.current.bye()
                break;
            case SessionState.Terminating:
            case SessionState.Terminated:
                // Cannot terminate a session that is already terminated
                break;
        }
    }

    //  function to register Phone
    function initPhone(user, apiorigin, element, optelement) {

        if (sessionRef.current) {
            endCall()
        }

        if (phonestate.registered) {
            regRef.current.unregister()
                .then(() => {
                    console.log('UNREGISTERED')
                    dispatch({ type: 'unregister' })
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        // configure useragent
        const transportOptions = {
            server: `wss://${apiorigin.split('//')[1]}${user.wss_binding}`
        }

        //  connect media
        streamRef.current = new MediaStream()

        if (optelement) {
            optstreamRef.current = new MediaStream()
        }

        // delegate call receiving
        function onInvite(invitation) {
            console.log(invitation.remoteIdentity._displayName)
            if (sessionRef.current) {
                invitation.reject()
                    .then(() => {
                        console.log(`rejected invitation from ${invitation.remoteIdentity._displayName}`)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                return
            }
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
                        setupRemoteMedia(sessionRef.current, element, optelement);
                        dispatch({ type: 'callaccept' })
                        break;
                    case SessionState.Terminating:
                    // fall through
                    case SessionState.Terminated:
                        sessionRef.current = null
                        cleanupMedia(element, optelement);
                        dispatch({ type: 'endtalk' })
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
        regRef.current = new Registerer(phoneRef.current)

        //  start and register
        phoneRef.current.start()
            .then(() => {
                regRef.current.register()
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
