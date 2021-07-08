/**
 * render a userlist
 */

import { useState } from 'react'
import User from './User'
import ExpUser  from './ExpUser'
import './UserList.css'

function UserList(props) {

    const [expanded, setExpanded] = useState(false)
    const [expuser, setExpuser] = useState(null)

    const {
        list,
        apiorigin
    } = props

    function handleExpand(obj) {
        setExpanded(obj.truth)
        setExpuser(obj.data)
    }

    /* useEffect(() => {
        if (list.findIndex(elem => elem.id === expanded.id) === -1) {
            setExpanded({})
        }
    }, []) */

    switch (expanded) {
        case false: {
            return (
                <div className="UserList">
                    {list.map(usr => <User
                        user={usr}
                        key={usr.id}
                        expand={handleExpand}
                    />)}
                </div>
            )
        }
        case true: {
            return (
                <div className='UserExpanded'>
                    <ExpUser
                        user={expuser}
                        expand={handleExpand}
                        apiorigin={apiorigin}
                    />
                </div>
            )
        }
        default: {
            console.log('hit default :-(')
        }
    }
}

export default UserList;