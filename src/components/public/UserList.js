/**
 * render a userlist
 */

import { useState } from 'react'
import User from './User'
import './UserList.css'

function UserList(props) {

    const {
        list
    } = props

    /* useEffect(() => {
        if (list.findIndex(elem => elem.id === expanded.id) === -1) {
            setExpanded({})
        }
    }, []) */

    return (
        <div className="UserList">
            {list.map(usr => <User
                user={usr}
                key={usr.id}
            />)}
        </div>
    )
}


export default UserList;