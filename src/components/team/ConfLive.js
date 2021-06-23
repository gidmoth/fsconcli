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
                <span className='ctr symb'>mic_off</span>
            </div>
            <div className='lockconf'>
                <span className='ctr symb'>lock</span>
            </div>
            <div className='kickconf'>
                <span className='ctr symb'>remove_circle</span>
            </div>
            <div className='rec'>
                <strong>Recording</strong>
            </div>
            <div className='rstat'>
                {recording.status}
            </div>
            <div className='ropt'>
                <span className='ctr symb'>not_started</span>
            </div>
            <div className='rstst'>
                <span className='ctr symb'>fiber_manual_record</span>
            </div>
            <div className='flrfl'>
                <strong>Floor</strong>
            </div>
            <div className='flrusr'>
                {floor.name}
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
                {JSON.stringify(lastleave)}
            </div>
            <div className='flrctr'>
                <span className='symb'>{floor.mute ? 'mic' : 'mic_off'}</span>
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