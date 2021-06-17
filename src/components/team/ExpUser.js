/**
 * render an expanded user
 */

import { useReducer, useRef } from 'react'
import './ExpUser.css';
import CallBtn from '../CallBtn'

function reducer(currstate, evn) {
    switch (evn.e) {
        case 'eNameChange': {
            return { ...currstate, eName: evn.data }
        }
        case 'modeswitch': {
            return { ...currstate, mode: evn.data }
        }
        default: {
            console.log('hit default :-(')
        }
    }

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

    const eNameRef = useRef()

    const { expand } = props

    const [state, dispatch] = useReducer(reducer, {
        mode: 'default',
        eName: name,
    })

    function eNameChange(evn) {
        dispatch({ e: 'eNameChange', data: evn.target.value })
    }

    switch (state.mode) {
        case 'default': {
            return (<>
                <div
                    className={'symb usrclose'}
                    onClick={() => expand({ truth: false, data: null })}
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
                    <span
                        className={'symb nocheck'}
                        onClick={() => dispatch({ e: 'modeswitch', data: 'edit' })}
                    >edit</span>
                    <span className={'symb nocheck'}>person_remove</span>
                </div>
            </>)
        }
        case 'edit': {
            return (<>
                <div
                    className={'symb usrclose'}
                    onClick={() => expand({ truth: false, data: null })}
                >close</div>
                <div className={'unhead'}><strong>{name}</strong></div>
                <dl>
                    <dt>new Name:</dt>
                    <dd>
                        <input
                            type='text'
                            size='15'
                            ref={eNameRef}
                            onChange={eNameChange}
                            value={state.eName}
                        />
                    </dd>
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
                    <span className={'symb nockeck'}>replay</span>
                    <span
                        className={'symb nocheck'}
                        onClick={() => dispatch({ e: 'modeswitch', data: 'default' })}
                    >edit_off</span>
                    <span className={'symb greencheck'}>check</span>
                </div>
            </>)
        }
        default: {
            console.log('hit default :-(')
        }
    }

}

export default ExpUser;