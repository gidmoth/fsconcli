/**
 * render a users
 */

import './Users.css';
import './RegList.css'
import { useContext, useEffect, useReducer, useRef } from 'react'
import { LiveContext } from '../LiveContext'
import { XmlContext } from '../XmlContext'
import CallBtn from '../CallBtn'

function uniquify(val, idx, arr) {
    return arr.findIndex(elem => elem.id === val.id) === idx
}

function getRegList(regs, users, filter) {
    let list = regs.map(usr => ({ ...usr, name: users.find(u => u.id === usr.id).name }))
    if (filter === '') {
        return list
    }
    let namesmatch = list.filter(usr => usr.name.toLowerCase().includes(filter.toLowerCase()))
    let sipconsmatch = list.filter(usr => usr.sipcon.includes(filter))
    let idmatch = list.filter(usr => usr.id.includes(filter))
    let retarr = [...namesmatch, ...sipconsmatch, ...idmatch]
    return retarr.filter(uniquify)
}


function reducer(currstate, evn) {
    switch (evn.e) {
        case 'newlist': {
            return { ...currstate, userlist: evn.data }
        }
        case 'filterchange': {
            return { ...currstate, filter: evn.data }
        }
        default: {
            console.log('hit default!')
        }
    }
}

function RegUser(props) {

    const {
        name,
        sipcon,
        id,
        regid
    } = props.user

    return (<>
        <div className="RegUser">
            <strong>{name}</strong><br />
            {id}<br />
            {sipcon}
        </div>
        <div className='RegUserAct'>
            <CallBtn number={id} />
        </div>
    </>)
}

function RegList() {

    const { liveState } = useContext(LiveContext)
    const { xmlState } = useContext(XmlContext)
    const { users } = xmlState
    const { registrations } = liveState

    const searchRef = useRef()

    const [state, dispatch] = useReducer(reducer, {
        filter: '',
        userlist: getRegList(registrations, users, ''),
    })

    useEffect(() => {
        dispatch({ e: 'newlist', data: getRegList(registrations, users, state.filter) })
    }, [users, registrations, state.filter])

    return (
        <>
            <div className={'usersmain'}>
                <div className={'searchbox'}>
                    <div className={'opttag'}>
                        <strong>Search:</strong>
                    </div>
                    <div>
                        <input
                            type='text'
                            size='10'
                            ref={searchRef}
                            onChange={e => dispatch({ e: 'filterchange', data: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <div className={'RegList'}>
                {state.userlist.map(usr => <RegUser
                    user={usr}
                    key={usr.sipcon}
                />)}
            </div>
        </>
    )
}

export default RegList;