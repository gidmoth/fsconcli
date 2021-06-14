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
            return { ...currstate, ringing: true, pop: true,  caller: event.value }
        }
        case 'popped': {
            return { ...currstate, pop: false }
        }
        case 'immiset':  {
            return { ...currstate, immicall: event.value }
        }
        case 'immiclear': {
            return  { ...currstate, immicall:  ''}
        }
        case 'talk': {
            return { ...currstate, talking: true, dtmf: true }
        }
        case 'unring': {
            return { ...currstate, ringing: false, caller:  '' }
        }
        case 'endtalk': {
            return { ...currstate, talking: false, dtmf: false, calling: false, ringing: false,  caller:  '', callee: '' }
        }
        case 'callanswered': {
            return { ...currstate, talking: true, calling: false, dtmf: true }
        }
        case 'call': {
            return { ...currstate, calling: true,  callee: event.value }
        }
        case 'uncall': {
            return { ...currstate, calling: false, callee: '' }
        }
        case 'callaccept': {
            return { ...currstate, ringing: false, talking: true, dtmf: true }
        }
        case 'togglevid': {
            return { ...currstate, video: !currstate.video }
        }
        case 'setstring': {
            return { ...currstate, dialtamplate: event.value }
        }
        case 'togdtmf': {
            return { ...currstate, dtmf: !currstate.dtmf }
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
        talking: false,
        dtmf: false,
        dialtamplate: '',
        caller: '',
        callee: '',
        immicall: ''
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
        if (phonestate.video) {
            session.sessionDescriptionHandler.peerConnection.getSenders().forEach((sender) => {
                if (sender.track) {
                    optstreamRef.current.addTrack(sender.track)
                }
            })
            optelement.srcObject = optstreamRef.current
            optelement.volume = 0
            optelement.play()
        }
    }

    // cleanup mediastream
    function cleanupMedia(element, optelement) {
        element.srcObject = null;
        element.pause();
        if (phonestate.video) {
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
    function makeCall(number, element, optelement) {
        if (sessionRef.current) {
            console.log('CANT MAKE TWO CALLS!')
            return
        }
        const target = UserAgent.makeURI(`sip:${number}@${phonestate.dialtamplate}`)
        const inviter = new Inviter(phoneRef.current, target)
        sessionRef.current = inviter
        sessionRef.current.stateChange.addListener((state) => {
            console.log(`Session state changed to ${state}`);
            switch (state) {
                case SessionState.Initial:
                    break;
                case SessionState.Establishing:
                    dispatch({ type: 'call', value: number })
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
                console.log('CALLING...')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // function to send dtmf
    function sendDtmf(sig, element, optelement) {
        const options = {
            requestOptions: {
                body: {
                    contentDisposition: 'render',
                    contentType: 'application/dtmf-relay',
                    content: `Signal=${sig}\r\nDuration=100`
                }
            }
        }
        if (sessionRef.current) {
            sessionRef.current.info(options)
            return
        }
        const target = UserAgent.makeURI(`sip:${sig}@${phonestate.dialtamplate}`)
        const inviter = new Inviter(phoneRef.current, target)
        sessionRef.current = inviter
        sessionRef.current.stateChange.addListener((state) => {
            console.log(`Session state changed to ${state}`);
            switch (state) {
                case SessionState.Initial:
                    break;
                case SessionState.Establishing:
                    dispatch({ type: 'call', value: sig })
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
                console.log('CALLING...')
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

        // set  state to hold sip-dialstring
        const todial = `${apiorigin.split('//')[1]}:${user.internal_tls_port}`
        dispatch({ type: 'setstring', value: todial })

        //  connect media
        streamRef.current = new MediaStream()

        if (phonestate.video) {
            optstreamRef.current = new MediaStream()
        }

        // delegate call receiving
        function onInvite(invitation) {
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
            dispatch({ type: 'ring',  value: `${invitation.remoteIdentity._displayName}` })
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
        regRef.current = new Registerer(phoneRef.current, {'expires': 3600})

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
        endCall: endCall,
        sendDtmf: sendDtmf
    }

    return (
        <PhoneContext.Provider value={value}>
            {props.children}
        </PhoneContext.Provider>
    )
}

// export what is needed
export { PhoneContext, PhoneProvider }
