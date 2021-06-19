/**
 * render an addbox
 */

import { useEffect, useReducer } from 'react'
import './ExpUser.css'
import './UserList.css'
import useFetch from './useFetch'

function reducer(currstate, evn) {
    switch (evn.e) {
        case 'modeswitch': {
            return { ...currstate, mode: evn.data }
        }
        case 'addresult': {
            return { ...currstate, mode: 'result', result: evn.data }
        }
        case 'redraw': {
            return {
                ...currstate,
                aName: '',
                aEmail: '',
                aContext: 'public',
                aPass: '',
                aPolymac: '',
                aConpin: '',
                mode: 'default'
            }
        }
        case 'aName': {
            return { ...currstate, aName: evn.data }
        }
        case 'aEmail': {
            return { ...currstate, aEmail: evn.data }
        }
        case 'aContext': {
            return { ...currstate, aContext: evn.data }
        }
        case 'aPass': {
            return { ...currstate, aPass: evn.data }
        }
        case 'aPolymac': {
            return { ...currstate, aPolymac: evn.data }
        }
        case 'aConpin': {
            return { ...currstate, aConpin: evn.data }
        }
        default: {
            console.log('hit default :-(')
        }
    }

}


function Addbox(props) {

    const { apiorigin } = props

    const { post, loading } = useFetch(apiorigin)

    const [state, dispatch] = useReducer(reducer, {
        mode: 'default',
        aName: '',
        aEmail: '',
        aContext: 'public',
        aPass: '',
        aPolymac: '',
        aConpin: '',
        result: null
    })

    useEffect(() => {
        if (loading) {
            dispatch({ e: 'modeswitch', data: 'loading' })
        }
    }, [loading])

    function adduser() {
        let postbody = [{ context: state.aContext }]
        if (state.aName.length > 0) {
            postbody[0].name = state.aName
        } else {
            dispatch({
                e: 'addresult', data: {
                    done: [],
                    failed: [{
                        error: 'name required',
                        user: { name: 'noname' }
                    }]
                }
            })
            return
        }
        if (state.aEmail.length > 0) {
            postbody[0].email = state.aEmail
        } else {
            dispatch({
                e: 'addresult', data: {
                    done: [],
                    failed: [{
                        error: 'email required',
                        user: { name: 'noemail' }
                    }]
                }
            })
            return
        }
        if (state.aPass.length > 0) {
            postbody[0].password = state.aPass
        }
        if (state.aPolymac.length > 0) {
            postbody[0].polymac = state.aPolymac
        }
        if (state.aConpin.length > 0) {
            postbody[0].conpin = state.aConpin
        }
        post('/api/users/add', postbody)
            .then(data => {
                dispatch({ e: 'addresult', data: data })
                console.log(data)
            })
            .catch(err => {
                dispatch({ e: 'modeswitch', data: 'result' })
                console.log(err)
            })
    }


    switch (state.mode) {
        case 'loading': {
            return (
                <div className='AddUser'>
                    <div><strong>loading...</strong></div>
                </div>
            )
        }
        case 'result': {
            switch (true) {
                case state.result.done.length > 0: {
                    return (
                        <div className='AddUser'>
                            <div className={'greencheck'}>success</div>
                            <div><strong>new user:</strong></div>
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
                            <div className={'addusnoract'}>
                                <span
                                    className={'symb greencheck'}
                                    onClick={() => dispatch({ e: 'redraw' })}
                                >check</span>
                            </div>
                        </div>
                    )
                }
                case state.result.failed.length > 0: {
                    return (
                        <div className='AddUser'>
                            <div className={'redcheck'}>error</div>
                            <div><strong>{state.result.failed[0].error}</strong></div>
                            <div>user {state.result.failed[0].user.name} not added.</div>
                            <div className={'addusnoract'}>
                                <span
                                    className={'symb greencheck'}
                                    onClick={() => dispatch({ e: 'redraw' })}
                                >check</span>
                            </div>
                        </div>
                    )
                }
            }
        }
        case 'default': {
            return (
                <div className='AddUser'>
                    <div className={'unhead'}><strong>new user</strong></div>
                    <dl>
                        <dt>new Name:</dt>
                        <dd>
                            <input
                                type='text'
                                size='15'
                                onChange={evn => dispatch({ e: 'aName', data: evn.target.value })}
                                value={state.aName}
                            /><br /><small>(required)</small>
                        </dd>
                        <dt>new email:</dt>
                        <dd>
                            <input
                                type='text'
                                size='15'
                                onChange={evn => dispatch({ e: 'aEmail', data: evn.target.value })}
                                value={state.aEmail}
                            /><br /><small>(required)</small>
                        </dd>
                        <dt>new Context:</dt>
                        <dd>
                            <select
                                value={state.aContext}
                                onChange={evn => dispatch({ e: 'aContext', data: evn.target.value })}
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
                                onChange={evn => dispatch({ e: 'aPass', data: evn.target.value })}
                                value={state.aPass}
                            /><br /><small>(empty to autogenerate)</small>
                        </dd>
                        <dt>new Polycom  MAC:</dt>
                        <dd>
                            <input
                                type='text'
                                size='15'
                                onChange={evn => dispatch({ e: 'aPolymac', data: evn.target.value })}
                                value={state.aPolymac}
                            /><br /><small>(empty or 'none' to not<br />provision polycom)</small>
                        </dd>
                        <dt>new Conference pin:</dt>
                        <dd>
                            <input
                                type='text'
                                size='15'
                                onChange={evn => dispatch({ e: 'aConpin', data: evn.target.value })}
                                value={state.aConpin}
                            />
                        </dd>
                    </dl>
                    <div className={'addusract'}>
                        <span
                            className={'symb redcheck'}
                            onClick={() => dispatch({ e: 'redraw' })}
                        >close</span>
                        <span
                            className={'symb greencheck'}
                            onClick={() => adduser()}
                        >check</span>
                    </div>
                </div>
            )
        }
        default: {
            console.log('hit default :-(')
        }
    }

}

export default Addbox;