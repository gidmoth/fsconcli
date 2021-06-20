/**
 * render an expanded user
 */

import { useEffect, useReducer, useRef } from 'react'
import './ExpUser.css';
import CallBtn from '../CallBtn'
import useFetch from './useFetch'

function reducer(currstate, evn) {
    switch (evn.e) {
        case 'eName': {
            return { ...currstate, eName: evn.data }
        }
        case 'eEmail': {
            return { ...currstate, eEmail: evn.data }
        }
        case 'eContext': {
            return { ...currstate, eContext: evn.data }
        }
        case 'ePass': {
            return { ...currstate, ePass: evn.data }
        }
        case 'ePolymac': {
            return { ...currstate, ePolymac: evn.data }
        }
        case 'eConpin': {
            return { ...currstate, eConpin: evn.data }
        }
        case 'modeswitch': {
            return { ...currstate, mode: evn.data }
        }
        case 'editresult': {
            return { ...currstate, mode: 'result', result: evn.data }
        }
        case 'delresult': {
            return { ...currstate, mode: 'delresult', result: evn.data }
        }
        case 'resedit': {
            return {
                ...currstate,
                eName: evn.data.name,
                eEmail: evn.data.email,
                eContext: evn.data.context,
                ePass: evn.data.password,
                ePolymac: evn.data.polymac,
                eConpin: evn.data.conpin
            }
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

    const { expand, apiorigin } = props

    const { post, loading } = useFetch(apiorigin)

    const [state, dispatch] = useReducer(reducer, {
        mode: 'default',
        eName: name,
        eEmail: email,
        eContext: context,
        ePass: password,
        ePolymac: polymac,
        eConpin: conpin,
        result: null
    })

    useEffect(() => {
        if (loading) {
            dispatch({ e: 'modeswitch', data: 'loading' })
        }
    }, [loading])

    function moduser() {
        let postbody = [{ id: id, context: state.eContext }]
        if (state.eName.length > 0) {
            postbody[0].name = state.eName
        }
        if (state.eEmail.length > 0) {
            postbody[0].email = state.eEmail
        }
        if (state.ePass.length > 0) {
            postbody[0].password = state.ePass
        }
        if (state.ePolymac.length > 0) {
            postbody[0].polymac = state.ePolymac
        }
        if (state.eConpin.length > 0) {
            postbody[0].conpin = state.eConpin
        }
        post('/api/users/mod', postbody)
            .then(data => {
                dispatch({ e: 'editresult', data: data })
                console.log(data)
            })
            .catch(err => {
                dispatch({ e: 'modeswitch', data: 'result' })
                console.log(err)
            })
    }

    function deluser() {
        let postbody = [{ id: id }]
        post('/api/users/del', postbody)
            .then(data => {
                dispatch({ e: 'delresult', data: data })
                console.log(data)
            })
            .catch(err => {
                dispatch({ e: 'modeswitch', data: 'result' })
                console.log(err)
            })
    }


    switch (state.mode) {
        case 'loading': {
            return (<>
                <div
                    className={'symb usrclose'}
                    onClick={() => expand({ truth: false, data: null })}
                >close</div>
                <div><strong>loading...</strong></div>
            </>)
        }
        case 'result': {
            switch (true) {
                case state.result.done.length > 0: {
                    return (<>
                        <div
                            className={'symb usrclose'}
                            onClick={() => expand({ truth: false, data: null })}
                        >close</div>
                        <div className={'greencheck'}>success</div>
                        <div><strong>modified user:</strong></div>
                        <dl>
                            <dt>Name:</dt>
                            <dd>{state.result.done[0].name}</dd>
                            <dt>ID:</dt>
                            <dd>{state.result.done[0].id}</dd>
                            <dt>email:</dt>
                            <dd>{state.result.done[0].email}</dd>
                            <dt>Context:</dt>
                            <dd>{state.result.done[0].context}</dd>
                            <dt>Password:</dt>
                            <dd>{state.result.done[0].password}</dd>
                            <dt>Polycom  MAC:</dt>
                            <dd>{state.result.done[0].polymac}</dd>
                            <dt>Conference  pin:</dt>
                            <dd>{state.result.done[0].conpin}</dd>
                        </dl>
                    </>)
                }
                case state.result.failed.length > 0: {
                    return (<>
                        <div
                            className={'symb usrclose'}
                            onClick={() => expand({ truth: false, data: null })}
                        >close</div>
                        <div className={'redcheck'}>error</div>
                        <div><strong>{state.result.failed[0].error}</strong></div>
                        <div>user {state.result.failed[0].user.name} unchanged.</div>
                    </>)
                }
            }
        }
        case 'delresult': {
            switch (true) {
                case state.result.done.length > 0: {
                    return (<>
                        <div
                            className={'symb usrclose'}
                            onClick={() => expand({ truth: false, data: null })}
                        >close</div>
                        <div className={'greencheck'}>success</div>
                        <div><strong>deletet {state.result.done[0].name}</strong></div>
                    </>)
                }
                case state.result.failed.length > 0: {
                    return (<>
                        <div
                            className={'symb usrclose'}
                            onClick={() => expand({ truth: false, data: null })}
                        >close</div>
                        <div className={'redcheck'}>error</div>
                        <div><strong>{state.result.failed[0].error}</strong></div>
                        <div>user {state.result.failed[0].user.name} unchanged.</div>
                    </>)
                }
            }
        }
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
                    <span
                        className={'symb nocheck'}
                        onClick={() => dispatch({ e: 'modeswitch', data: 'askdel' })}
                    >person_remove</span>
                </div>
            </>)
        }
        case 'askdel': {
            return (<>
                <div
                    className={'symb usrclose'}
                    onClick={() => expand({ truth: false, data: null })}
                >close</div>
                <div>Are you sure to delete</div>
                <div className={'unhead'}><strong>{name}?</strong></div>
                <div className={'addusract'}>
                    <span
                        className={'symb redcheck'}
                        onClick={() => dispatch({ e: 'modeswitch', data: 'default' })}
                    >close</span>
                    <span
                        className={'symb greencheck'}
                        onClick={() => deluser()}
                    >check</span>
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
                            onChange={evn => dispatch({ e: 'eName', data: evn.target.value })}
                            value={state.eName}
                        />
                    </dd>
                    <dt>new email:</dt>
                    <dd>
                        <input
                            type='text'
                            size='15'
                            onChange={evn => dispatch({ e: 'eEmail', data: evn.target.value })}
                            value={state.eEmail}
                        />
                    </dd>
                    <dt>new Context:</dt>
                    <dd>
                        <select
                            value={state.eContext}
                            onChange={evn => dispatch({ e: 'eContext', data: evn.target.value })}
                        >
                            <option value='team'>team</option>
                            <option value='friends'>friends</option>
                            <option value='public'>public</option>
                        </select>
                    </dd>
                    <dt>new Password:</dt>
                    <dd>
                        <input
                            type='text'
                            size='15'
                            onChange={evn => dispatch({ e: 'ePass', data: evn.target.value })}
                            value={state.ePass}
                        /><br /><small>(empty to generate new)</small>
                    </dd>
                    <dt>new Polycom  MAC:</dt>
                    <dd>
                        <input
                            type='text'
                            size='15'
                            onChange={evn => dispatch({ e: 'ePolymac', data: evn.target.value })}
                            value={state.ePolymac}
                        /><br /><small>(empty  or 'none' to disable< br />polycom provisioning)</small>
                    </dd>
                    <dt>new Conference pin:</dt>
                    <dd>
                        <input
                            type='text'
                            size='15'
                            onChange={evn => dispatch({ e: 'eConpin', data: evn.target.value })}
                            value={state.eConpin}
                        />
                    </dd>
                </dl>
                <div className={'expusract'}>
                    <span
                        className={'symb nockeck'}
                        onClick={() => dispatch({ e: 'resedit', data: props.user })}
                    >replay</span>
                    <span
                        className={'symb nocheck'}
                        onClick={() => dispatch({ e: 'modeswitch', data: 'default' })}
                    >edit_off</span>
                    <span
                        className={'symb greencheck'}
                        onClick={() => moduser()}
                    >check</span>
                </div>
            </>)
        }
        default: {
            console.log('hit default :-(')
        }
    }

}

export default ExpUser;