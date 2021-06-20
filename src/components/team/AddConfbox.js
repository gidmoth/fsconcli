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
                aContext: 'public',
                aType: '16kHz-novideo',
                mode: 'default'
            }
        }
        case 'aName': {
            return { ...currstate, aName: evn.data }
        }
        case 'aContext': {
            return { ...currstate, aContext: evn.data }
        }
        case 'aType': {
            return { ...currstate, aType: evn.data }
        }
        default: {
            console.log('hit default :-(')
        }
    }

}


function AddConfbox(props) {

    const { apiorigin, conferencetypes } = props

    const { get, post, loading } = useFetch(apiorigin)

    const [state, dispatch] = useReducer(reducer, {
        mode: 'default',
        aName: '',
        aContext: 'public',
        aType: '16kHz-novideo',
        result: null
    })

    /* useEffect(() => {
        if (loading) {
            dispatch({ e: 'modeswitch', data: 'loading' })
        }
    }, [loading]) */

    function addconf() {
        let postbody = [{ context: state.aContext, type: state.aType }]
        if (state.aName.length > 0) {
            if (state.aName.includes(' ')) {
                dispatch({
                    e: 'addresult', data: {
                        done: [],
                        failed: [{
                            error: 'confnames may not contain whitespace',
                            conference: { name: 'novalid' }
                        }]
                    }
                })
                return
            } else {
                postbody[0].name = state.aName
            }
        } else {
            dispatch({
                e: 'addresult', data: {
                    done: [],
                    failed: [{
                        error: 'name required',
                        conference: { name: 'noname' }
                    }]
                }
            })
            return
        }

        post('/api/conferences/add', postbody)
            .then(data => {
                dispatch({ e: 'addresult', data: data })
                console.log(data)
                get('/api/conferences/rebuildcontacts')
                    .then(dat => {
                        console.log(dat)
                    })
                    .catch(err => {
                        console.log(err)
                    })
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
                            <div><strong>new conference:</strong></div>
                            <dl>
                                <dt>Name:</dt>
                                <dd>{state.result.done[0].name}</dd>
                                <dt>Number:</dt>
                                <dd>{state.result.done[0].num}</dd>
                                <dt>Context:</dt>
                                <dd>{state.result.done[0].context}</dd>
                                <dt>Type:</dt>
                                <dd>{state.result.done[0].type}</dd>
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
                            <div>conference {state.result.failed[0].conference.name} not added.</div>
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
                    <div className={'unhead'}><strong>new conference</strong></div>
                    <dl>
                        <dt>new Name:</dt>
                        <dd>
                            <input
                                type='text'
                                size='15'
                                onChange={evn => dispatch({ e: 'aName', data: evn.target.value })}
                                value={state.aName}
                            /><br /><small>(required, no whitespace)</small>
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
                        <dt>new Type:</dt>
                        <dd>
                            <select
                                value={state.eType}
                                onChange={evn => dispatch({ e: 'eType', data: evn.target.value })}
                            >
                                {conferencetypes.map(type => <option value={type} key={type}>{type}</option>)}
                            </select>
                        </dd>
                    </dl>
                    <div className={'addusract'}>
                        <span
                            className={'symb redcheck'}
                            onClick={() => dispatch({ e: 'redraw' })}
                        >close</span>
                        <span
                            className={'symb greencheck'}
                            onClick={() => addconf()}
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

export default AddConfbox;