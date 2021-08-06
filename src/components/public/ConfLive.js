/**
 * render a users
 */

import './Users.css';
import './RegList.css'
import './MemList.css'
import { useContext, useEffect, useReducer, useState } from 'react'
import { LiveContext } from '../LiveContext'
import { SocketContext } from '../SocketContext'
import CallBtn from '../CallBtn'

function getMemList(mems, filter) {
    if (filter === '') {
        return mems
    }
    return mems.filter(mem => mem.name.toLowerCase().includes(filter.toLowerCase()))
}

function memreducer(currstate, evn) {
    switch (evn.e) {
        case 'filterchange': {
            return { ...currstate, filter: evn.data }
        }
        case 'newlist': {
            return { ...currstate, memlist: evn.data }
        }
        default: {
            console.log('hit default!')
        }
    }
}

function LiveConf(props) {

    const {
        name,
        recording,
        locked,
        floor,
        lastjoin,
        lastleave,
        memcount,
        members,
        num,
        type
    } = props.conf

    const { sendreq } = useContext(SocketContext)

    const [open, setOpen] = useState(false)

    const [state, dispatch] = useReducer(memreducer, {
        filter: '',
        memlist: getMemList(members, ''),
    })

    useEffect(() => {
        dispatch({ e: 'newlist', data: getMemList(members, state.filter) })
    }, [members, state.filter])

    function togopen() {
        setOpen(!open)
    }

    function lockunlock() {
        switch (locked) {
            case true: {
                sendreq({
                    req: 'exec',
                    call: 'unlock',
                    conference: name
                })
                break
            }
            case false: {
                sendreq({
                    req: 'exec',
                    call: 'lock',
                    conference: name
                })
                break
            }
            default: {
                console.log('hit default :-(')
            }
        }
    }

    function recstst() {
        switch (recording.status) {
            case 'norec': {
                sendreq({
                    req: 'exec',
                    call: 'startrec',
                    conference: name
                })
                break
            }
            default: {
                sendreq({
                    req: 'exec',
                    call: 'stoprec',
                    conference: name
                })
            }
        }
    }

    function recopt() {
        switch (recording.status) {
            case 'norec': {
                console.log('nothing  to  do!')
                break
            }
            case 'running': {
                sendreq({
                    req: 'exec',
                    call: 'pauserec',
                    conference: name
                })
                break
            }
            case 'paused': {
                sendreq({
                    req: 'exec',
                    call: 'resumerec',
                    conference: name
                })
                break
            }
            default: {
                console.log('hit default :-(')
            }
        }
    }

    function optrecbtn() {
        switch (recording.status) {
            case 'running': {
                return 'pause'
            }
            case 'paused': {
                return 'play_arrow'
            }
            default: {
                return ''
            }
        }
    }

    function togusrmute(confid, mute) {
        if (mute) {
            sendreq({
                req: 'memexec',
                call: 'unmute',
                conference: name,
                member: confid
            })
        } else {
            sendreq({
                req: 'memexec',
                call: 'mute',
                conference: name,
                member: confid
            })
        }
    }

    function kickmem(confid) {
        sendreq({
            req: 'memexec',
            call: 'kick',
            conference: name,
            member: confid
        })
    }

    return (
        <div className={'liveconf'}>
            <div className='namec'>
                <strong>{name}</strong><br />
                <span className='smalltit'>{type}</span>
            </div>
            <div className='mcl'>
                <strong>Membercount:</strong>
            </div>
            <div className='mcr'>
                {memcount}
            </div>
            <div className='callconf'>
                <CallBtn number={num} />
            </div>
            <div className='muteconf'>
                <span
                    className='ctr symb'
                    onClick={() => sendreq({
                        req: 'exec',
                        call: 'muteall',
                        conference: name
                    })}
                >mic_off</span>
            </div>
            <div className='lockconf'>
                <span
                    className='ctr symb'
                    onClick={lockunlock}
                >{locked ? 'lock_open' : 'lock'}</span>
            </div>
            <div className='kickconf'>
                <span
                    className='ctr symb'
                    onClick={() => sendreq({
                        req: 'exec',
                        call: 'kickall',
                        conference: name
                    })}
                >remove_circle</span>
            </div>
            <div className='rec'>
                <strong>Recording</strong>
            </div>
            <div className='rstat'>
                Status:<br /><strong>{recording.status}</strong>
            </div>
            <div className='ropt'>
                <span
                    className='ctr symb'
                    onClick={recopt}
                >{optrecbtn()}</span>
            </div>
            <div className='rstst'>
                <span
                    className='ctr symb'
                    onClick={recstst}
                >{recording.status === 'norec' ?
                    'fiber_manual_record' :
                    'stop'}</span>
            </div>
            <div className='flrfl'>
                <strong>Floor</strong>
            </div>
            <div className='flrusr'>
                Name:<br /><strong>{floor.name}</strong>
            </div>
            <div className='jol'>
                <strong>Lastjoin:</strong>
            </div>
            <div className='jor'>
                {lastjoin.name}
            </div>
            <div className='lel'>
                <strong>Lastleave:</strong>
            </div>
            <div className='ler'>
                {lastleave.name === undefined ? 'nobody' : lastleave.name}
            </div>
            <div className='flrctr'>
                <span
                    className='ctr symb'
                    onClick={() => togusrmute(floor.confid, floor.mute)}
                >{floor.mute ? 'mic' : 'mic_off'}</span>
            </div>
            <div className='mlist'>
                <div className='listmems'>
                    <div className='mltit'>
                        <strong>MEMBERS</strong>
                    </div>
                    <div className='mlexp'>
                        <span
                            className='ctr symb'
                            onClick={togopen}
                        >{open ? 'expand_less' : 'expand_more'}
                        </span>
                    </div>
                    <div className={open ? 'memse' : 'nodisp'}>
                        <strong>search:</strong>
                    </div>
                    <div className={open ? 'msfl' : 'nodisp'}>
                        <input
                            type='text'
                            size='10'
                            onChange={e => dispatch({ e: 'filterchange', data: e.target.value })}
                        />
                    </div>
                    <div className={open ? 'mmml' : 'nodisp'}>
                        {state.memlist.map(mem => <div
                            className='mInList'
                            key={mem.confid}
                        >
                            <div className='mname'>
                                <strong>{mem.name}</strong>
                            </div>
                            <div className='macta'>
                                <span
                                    className='ctr symb'
                                    onClick={() => togusrmute(mem.confid, mem.mute)}
                                >{mem.mute ? 'mic' : 'mic_off'}
                                </span>
                            </div>
                            <div className='mactb'>
                                <span
                                    className='ctr symb'
                                    onClick={() => kickmem(mem.confid)}
                                >remove_circle</span>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function reducer(currstate, evn) {
    switch (evn.e) {
        case 'newlist': {
            return { ...currstate, conflist: evn.data }
        }
        default: {
            console.log('hit default!')
        }
    }
}

function ConfLive() {

    const { liveState } = useContext(LiveContext)
    const { conferences } = liveState

    const [state, dispatch] = useReducer(reducer, {
        conflist: conferences
    })

    useEffect(() => {
        dispatch({ e: 'newlist', data: conferences })
    }, [conferences])

    switch (true) {
        case conferences.length === 0: {
            return (
                <>
                    <div className={'LconList'}>
                        No active conferences.
                    </div>
                </>
            )
        }
        case conferences.length > 0: {
            return (
                <>
                    <div className={'LconList'}>
                        {state.conflist.map(conf => <LiveConf
                            conf={conf}
                            key={conf.name}
                        />)}
                    </div>
                </>
            )
        }
        default: {
            console.log('hit default :-(')
        }
    }

}

export default ConfLive;