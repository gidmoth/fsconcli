/**
 * context to share lifestate
 */

import { createContext, useReducer } from 'react'

// reducer for stateupdating
function reducer(currstate, event) {

    // functions to create deepcopy of current state
    function usercopy(usr) {
        return { ...usr }
    }

    function memcopy(memarray) {
        if (memarray) {
            return memarray.map(mem => usercopy(mem))
        }
    }

    function confcopy(conf) {
        return {
            name: conf.name,
            recording: { ...conf.recording },
            locked: conf.locked,
            floor: usercopy(conf.floor),
            lastjoin: usercopy(conf.lastjoin),
            lastleave: usercopy(conf.lastleave),
            memcount: conf.memcount,
            members: memcopy(conf.members)
        }
    }

    function confstatecopy(confarray) {
        return confarray.map(cnf => confcopy(cnf))
    }

    function regusrcp(usr) {
        return { ...usr }
    }

    function regstatecopy(regarray) {
        if (regarray.length > 0) {
            return regarray.map(usr => regusrcp(usr))
        } else {
            return []
        }
    }

    function oldxmlcopy(oldxml) {
        return oldxml
    }

    function newstate(currstate) {
        return {
            conferences: confstatecopy(currstate.conferences),
            registrations: regstatecopy(currstate.registrations),
            oldxml: oldxmlcopy(currstate.oldxml)
        }
    }

    // switch on recieved message
    switch (event.event) {
        case 'newLiveState': {
            return {
                conferences: event.data,
                registrations: regstatecopy(currstate.registrations),
                oldxml: oldxmlcopy(currstate.oldxml)
            }
        }
        case 'newXML': {
            return {
                conferences: confstatecopy(currstate.conferences),
                registrations: regstatecopy(currstate.registrations),
                oldxml: true
            }
        }
        case 'gotXML': {
            return {
                conferences: confstatecopy(currstate.conferences),
                registrations: regstatecopy(currstate.registrations),
                oldxml: false
            }
        }
        case 'reply': {
            switch (event.reply) {
                case 'init': {
                    return {
                        conferences: event.data,
                        registrations: regstatecopy(currstate.registrations),
                        oldxml: oldxmlcopy(currstate.oldxml)
                    }
                }
                case 'initreg': {
                    return {
                        conferences: confstatecopy(currstate.conferences),
                        registrations: event.data,
                        oldxml: oldxmlcopy(currstate.oldxml)
                    }
                }
                default: {
                    console.log(`unhandled: ${JSON.stringify(event)}`)
                    return newstate(currstate)
                }
            }
        }
        case 'error': {
            console.log(`ERROR: ${JSON.stringify(event)}`)
            return newstate(currstate)
        }
        default: {
            let returnstate = newstate(currstate)
            switch (event.event) {
                case 'newConference': {
                    returnstate.conferences.push(event.data)
                    return returnstate
                }
                case 'addReg': {
                    returnstate.registrations.push(event.user)
                    return returnstate
                }
                case 'delReg': {
                    let newregs = returnstate.registrations.filter(user => user.id !== event.user.id)
                    returnstate.registrations = newregs
                    return returnstate
                }
                default: {
                    let confidx = returnstate.conferences.findIndex(cnf => cnf.name === event.conference)
                    switch (event.event) {
                        case 'newMember': {
                            returnstate.conferences[confidx].members.push(event.data)
                            returnstate.conferences[confidx].lastjoin = event.data
                            returnstate.conferences[confidx].memcount++
                            return returnstate
                        }
                        case 'floorchange': {
                            returnstate.conferences[confidx].floor = event.data
                            return returnstate
                        }
                        case 'recStop': {
                            returnstate.conferences[confidx].recording.status = 'norec'
                            delete returnstate.conferences[confidx].recording.file
                            return returnstate
                        }
                        case 'recResume': {
                            returnstate.conferences[confidx].recording.status = 'running'
                            return returnstate
                        }
                        case 'recPause': {
                            returnstate.conferences[confidx].recording.status = 'paused'
                            return returnstate
                        }
                        case 'recStart': {
                            returnstate.conferences[confidx].recording.status = 'running'
                            returnstate.conferences[confidx].recording.file = event.file
                            return returnstate
                        }
                        case 'delConference': {
                            returnstate.conferences.splice(confidx, 1)
                            return returnstate
                        }
                        case 'lock': {
                            returnstate.conferences[confidx].locked = true
                            return returnstate
                        }
                        case 'unlock': {
                            returnstate.conferences[confidx].locked = false
                            return returnstate
                        }
                        case 'muteAll': {
                            returnstate.conferences[confidx].members.forEach(mem => {
                                mem.mute = true
                            })
                            if (returnstate.conferences[confidx].floor.mute !== undefined) {
                                returnstate.conferences[confidx].floor.mute = true
                            }
                            return returnstate
                        }
                        default: {
                            let memidx = returnstate.conferences[confidx].members
                                .findIndex(mem => mem.confid === event.data)
                            switch (event.event) {
                                case 'delMember': {
                                    returnstate.conferences[confidx].lastleave = returnstate.conferences[confidx].members[memidx]
                                    returnstate.conferences[confidx].members.splice(memidx, 1)
                                    returnstate.conferences[confidx].memcount--
                                    return returnstate
                                }
                                case 'mute': {
                                    returnstate.conferences[confidx].members[memidx].mute = true
                                    if (returnstate.conferences[confidx].members[memidx].confid === returnstate.conferences[confidx].floor.confid) {
                                        returnstate.conferences[confidx].floor.mute = true
                                    }
                                    return returnstate
                                }
                                case 'unmute': {
                                    returnstate.conferences[confidx].members[memidx].mute = false
                                    if (returnstate.conferences[confidx].members[memidx].confid === returnstate.conferences[confidx].floor.confid) {
                                        returnstate.conferences[confidx].floor.mute = false
                                    }
                                    return returnstate
                                }
                                default: {
                                    console.log(`unhandled: ${JSON.stringify(event)}`)
                                    return newstate(currstate)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// get context  object
const LiveContext = createContext()

// construct provider
function LiveProvider(props) {

    //  get a state for xmlstate
    const [liveState, dispatch] = useReducer(reducer, {
        conferences: [],
        registrations: [],
        oldxml: false
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

