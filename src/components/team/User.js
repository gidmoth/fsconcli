/**
 * render a user
 */

//import './User.css';

function User(props) {

    const {
        name,
        id,
        password,
        conpin,
        context,
        email,
        polymac
    } = props.data
    
    return (
        <div className="User">
            User: {name}<br/>
            email: {email}
        </div>
    )
}

export default User;