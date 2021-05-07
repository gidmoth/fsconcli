/**
 * render a userlist
 */

import User from './User'

//import './UsersPage.css';

function UsersPage({users}) {
    return (
        <div className="UsersPage">
            {
                users.map(usr => <User key={usr.id} data={usr}/>)
            }
        </div>
    )
}

export default UsersPage;