/**
 * render a users
 */

import './Users.css';
import './RegList.css'
import { useContext, useEffect, useReducer, useRef } from 'react'
import { LiveContext } from '../LiveContext'
import CallBtn from '../CallBtn'

function LiveConf(props) {

    const {
        name,
        recording,
        locked,
        floor,
        lastjoin,
        lastleave,
        memcount,
        members
    } = props.conf

    return (
        <div className={'liveconf'}>
            <strong>{name}</strong>
            <dl>
                <dt>floor:</dt>
                <dd>{floor.name}</dd>
                <dt>lastjoin:</dt>
                <dd>{lastjoin.name}</dd>
                <dt>lastleave:</dt>
                <dd>{lastleave.name}</dd>
                <dt>recording:</dt>
                <dd>{recording.status}</dd>
                <dt>locked:</dt>
                <dd>{JSON.stringify(locked)}</dd>
                <dt>membercount:</dt>
                <dd>{memcount}</dd>
            </dl>
        </div>
    )
}



function ConfLive() {

    const { liveState } = useContext(LiveContext)
    const { conferences } = liveState


    return (
        <>
            <div className={'LconList'}>
                {conferences.map(conf => <LiveConf
                    conf={conf}
                    key={conf.name}
                />)}
            </div>
        </>
    )
}

export default ConfLive;