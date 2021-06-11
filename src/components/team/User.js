/**
 * render a user
 */

import './User.css';

function User(props) {

    const {
        name,
        id,
        password,
        conpin,
        context,
        email,
        polymac
    } = props.user
    
    return (
        <div className="User">
            User: {name}<br/>
            email: {email}
        </div>
    )
}

export default User;