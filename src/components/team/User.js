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

    const { expand } = props

    return (<>
        <div className="User">
            <strong>{name}</strong><br />
            {id}
        </div>
        <div className='UserAct'>
            <span
                className={'symb'}
                onClick={() => expand({truth: true, data: props.user})}
            >
                more_horiz
            </span>
        </div>
    </>)
}

export default User;