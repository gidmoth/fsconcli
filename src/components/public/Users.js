/**
 * render a users
 */

import './Users.css';
import { useContext, useEffect, useReducer, useRef } from 'react'
import { XmlContext } from '../XmlContext'
import UserList from './UserList'

function uniquify(val, idx, arr) {
    return arr.findIndex(elem => elem.id === val.id) === idx
}

function getUserList(users, ctxf, filter) {
    let ctxret = []
    switch (ctxf) {
        case 'all': {
            ctxret = [...users]
            break
        }
        case 'team': {
            ctxret = users.filter(usr => usr.context === 'team')
            break
        }
        case 'friends': {
            ctxret = users.filter(usr => usr.context === 'friends')
            break
        }
        case 'public': {
            ctxret = users.filter(usr => usr.context === 'public')
            break
        }
        default: {
            console.log('hit default :-(')
        }
    }
    if (filter === '') {
        return ctxret
    }
    let namesmatch = ctxret.filter(usr => usr.name.toLowerCase().includes(filter.toLowerCase()))
    let idmatch = ctxret.filter(usr => usr.id.toLowerCase().includes(filter.toLowerCase()))
    let retarr = [...namesmatch, ...idmatch]
    return retarr.filter(uniquify)
}


function reducer(currstate, evn) {
    switch (evn.e) {
        case 'ctxfilterch': {
            return { ...currstate, ctxfilter: evn.data }
        }
        case 'newuserlist': {
            return { ...currstate, userlist: evn.data }
        }
        case 'filterchange': {
            return { ...currstate, filter: evn.data }
        }
        case 'usersearch': {
            return (
                currstate.mode === 'search' ?
                    { ...currstate, filter: '', ctxfilter: 'all' } :
                    { ...currstate, mode: 'search' }
            )
        }
        default: {
            console.log('hit default!')
        }
    }
}

function Users() {

    const { xmlState } = useContext(XmlContext)

    const { users } = xmlState

    const searchRef = useRef()

    const [state, dispatch] = useReducer(reducer, {
        ctxfilter: 'all',
        userlist: users,
        filter: '',
        mode: 'search'
    })

    useEffect(() => {
        dispatch({ e: 'newuserlist', data: getUserList(users, state.ctxfilter, state.filter) })
        if (state.filter === '') {
            searchRef.current.value = ''
        }
    }, [state.ctxfilter, state.filter, users])

    function filterchange(evn) {
        dispatch({ e: 'filterchange', data: evn.target.value })
    }

    return (
        <>
            <div className={'usersmain'}>
                <div className={'usermenu'}>
                    <span
                        className={'symb'}
                        onClick={() => dispatch({ e: 'usersearch' })}
                    >
                        refresh
                    </span>
                </div>
                <div className={'searchbox'}>
                    <div className={'opttag'}><strong>Context:</strong></div>
                    <div>
                        <select
                            value={state.ctxfilter}
                            onChange={e => dispatch({ e: 'ctxfilterch', data: `${e.target.value}` })}
                        >
                            <option value='all'>all</option>
                            <option value='team'>team</option>
                            <option value='friends'>friends</option>
                            <option value='public'>public</option>
                        </select>
                    </div>
                    <div className={'opttag'}>
                        <strong>Search:</strong>
                    </div>
                    <div>
                        <input
                            type='text'
                            size='10'
                            ref={searchRef}
                            onChange={filterchange}
                        />
                    </div>
                    <div className={'opttag'}>
                        <strong>Matchcount:</strong>
                    </div>
                    <div>
                        {state.userlist.length}
                    </div>
                </div>
            </div>
            <div>
                <UserList
                    list={state.userlist}
                />
            </div>
        </>
    )
}

export default Users;