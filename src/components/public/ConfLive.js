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

    return (
        <div className={'liveconf'}>
            <div className='namec'>
                <strong>{name}</strong><br />
                <span className='smalltit'>{type}</span>
            </div>
            <div className='callc'>
                <CallBtn number={num} />
            </div>
            <div className='confsh'>
                <dl>
                    <dt>Floor</dt>
                    <dd>{floor.name}</dd>
                    <dt>Recording</dt>
                    <dd>{recording.status}</dd>
                    <dt>Membercount</dt>
                    <dd>{memcount}</dd>
                    <dt>Lastjoin</dt>
                    <dd>{lastjoin.name}</dd>
                    <dt>Lastleave</dt>
                    <dd>{lastleave.name === undefined ? 'nobody' : lastleave.name}</dd>
                </dl>
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