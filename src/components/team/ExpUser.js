/**
 * render an expanded user
 */

import { useReducer, useRef } from 'react'
import './ExpUser.css';
import CallBtn from  '../CallBtn'

function reducer(evn)  {

}


function ExpUser(props) {

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

    const [state, dispatch] = useReducer(reducer, {
        mode: 'default'
    })

    switch (state.mode) {
        case  'default':  {
            return  (<>
                <div
                className={'symb usrclose'}
                onClick={()  => expand({truth:  false,  data: null})}
                >close</div>
                <div className={'unhead'}><strong>{name}</strong></div>
                <dl>
                    <dt>ID:</dt>
                    <dd>{id}</dd>
                    <dt>email:</dt>
                    <dd>{email}</dd>
                    <dt>Context:</dt>
                    <dd>{context}</dd>
                    <dt>Password:</dt>
                    <dd>{password}</dd>
                    <dt>Polycom  MAC:</dt>
                    <dd>{polymac}</dd>
                    <dt>Conference  pin:</dt>
                    <dd>{conpin}</dd>
                </dl>
                <div className={'expusract'}>
                    <CallBtn number={id} />
                    <span className={'symb'}>edit</span>
                    <span className={'symb'}>person_remove</span>
                </div>
            </>)
        }
        default:  {
            console.log('hit default :-(')
        }
    }
    
}

export default ExpUser;