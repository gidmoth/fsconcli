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
            Welcome {name}
        </div>
    )
}

export default User;