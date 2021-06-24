/**
 * render a users
 */

import './Users.css';
import './RegList.css'
import { useContext, useEffect, useReducer, useRef } from 'react'
import { LiveContext } from '../LiveContext'
import { XmlContext } from '../XmlContext'
import { SocketContext } from '../SocketContext'
import CallBtn from '../CallBtn'

function getConfList(lconfs, xmlconfs) {
    return lconfs.map(c => ({
        ...c,
        num: xmlconfs.find(k => k.name === c.name).num,
        type: xmlconfs.find(k => k.name === c.name).type
    }))
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
                <strong>{recording.status}</strong>
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
                <strong>{floor.name}</strong>
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
                    className='symb'
                    onClick={() => togusrmute(floor.confid, floor.mute)}
                >{floor.mute ? 'mic' : 'mic_off'}</span>
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

    const { xmlState } = useContext(XmlContext)

    const [state, dispatch] = useReducer(reducer, {
        conflist: getConfList(conferences, xmlState.conferences),
    })

    useEffect(() => {
        dispatch({ e: 'newlist', data: getConfList(conferences, xmlState.conferences) })
    }, [conferences, xmlState])

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