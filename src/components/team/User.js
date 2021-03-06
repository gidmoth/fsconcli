/**
 * render a user
 */

import './User.css';
import CallBtn from  '../CallBtn'

function User(props) {

    const {
        name,
        id
    } = props.user

    const { expand } = props

    return (<>
        <div className="User">
            <strong>{name}</strong><br />
            {id}
        </div>
        <div className='UserAct'>
            <span
                className={'symb padsymb'}
                onClick={() => expand({truth: true, data: props.user})}
            >
                more_horiz
            </span>
            <CallBtn number={id} />
        </div>
    </>)
}

export default User;