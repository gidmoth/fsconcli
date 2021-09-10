/**
 * render a users
 */

import './Users.css';
import './RegList.css'
import './MemList.css'
import { useContext, useEffect, useReducer, useState } from 'react'
import { LiveContext } from '../LiveContext'
//import { SocketContext } from '../SocketContext'
import CallBtn from '../CallBtn'


function LiveConf(props) {

    const {
        name,
        floor,
        num,
        type
    } = props.conf

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
                </dl>
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