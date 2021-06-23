/**
 * render a users
 */

import './Users.css';
import './RegList.css'
import { useContext, useEffect, useReducer, useRef } from 'react'
import { LiveContext } from '../LiveContext'
import { XmlContext } from '../XmlContext'
import CallBtn from '../CallBtn'

function getConfList(lconfs, xmlconfs) {
    return lconfs.map(c => ({ ...c, num: xmlconfs.find(k => k.name === c.name).num }))
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
        num
    } = props.conf

    return (
        <div className={'liveconf'}>
            <div className='namec'><strong>{name}</strong></div>
            <div className='callconf'>
                <CallBtn number={num} />
            </div>
            <div className='muteconf ctr symb'>
                mic_off
            </div>
            <div className='lockconf ctr symb'>
                lock
            </div>
            <div className='kickconf ctr symb'>
                remove_circle
            </div>
            <div className='flrusr'>
                <strong>floor</strong><br />{floor.name}
            </div>
            <div className='symb flrctr'>
                {floor.mute ? 'mic' : 'mic_off'}
            </div>
            {/* <div>{JSON.stringify(props.conf)}</div> */}
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

export default ConfLive;