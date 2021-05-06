/**
 * render a userlist
 */

import User from './User'

//import './UserList.css';

function UserList({list}) {
    return (
        <div className="UserList">
            {
                list.map(usr => <User key={usr.id} data={usr}/>)
            }
        </div>
    )
}

export default UserList;