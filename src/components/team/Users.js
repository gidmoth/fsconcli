/**
 * render a users
 */

import './Users.css';
import User from './User'
import { useContext, useEffect, useReducer } from 'react'
import { XmlContext } from '../XmlContext'

function getUserList(users, ctxf) {
    switch (ctxf) {
        case 'all': {
            return users
        }
        case 'team': {
            return users.filter(usr => usr.context === 'team')
        }
        case 'friends': {
            return users.filter(usr => usr.context === 'friends')
        }
        case 'public': {
            return users.filter(usr => usr.context === 'public')
        }
    }
}


function reducer(currstate, evn) {
    switch (evn.e) {
        case 'ctxfilterch': {
            return { ...currstate, ctxfilter: evn.data }
        }
        case 'newuserlist': {
            return { ...currstate, userlist: evn.data }
        }
        default: {
            console.log('hit default!')
        }
    }
}

function Users(props) {

    const { xmlState } = useContext(XmlContext)

    const { users } = xmlState

    const [state, dispatch] = useReducer(reducer, {
        ctxfilter: 'all',
        userlist: users
    })

    useEffect(() => {
        dispatch({e: 'newuserlist',  data: getUserList(users,  state.ctxfilter)})
    }, [state.ctxfilter])

    return (
        <>
            <div className={'usersmain'}>
                <div>Usersmain</div>
                <div className={'ctxfiltersep'}>
                    Contextfilter:&nbsp;&nbsp;
                    <select
                    value={state.ctxfilter}
                    onChange={e => dispatch({e: 'ctxfilterch', data: `${e.target.value}`})}
                    >
                        <option value='all'>all</option>
                        <option value='team'>team</option>
                        <option value='friends'>friends</option>
                        <option value='public'>public</option>
                    </select>
                    <hr/>
                </div>
            </div>
            <div className={'users'}>
                {state.userlist.map(usr => <User user={usr} />)}
            </div>
        </>
    )
}

export default Users;