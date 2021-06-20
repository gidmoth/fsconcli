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
        case 'eContext': {
            return { ...currstate, eContext: evn.data }
        }
        case 'eNum': {
            return { ...currstate, eNum: evn.data }
        }
        case 'eType': {
            return { ...currstate, eType: evn.data }
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
                eContext: evn.data.context,
                eNum: evn.data.num,
                eType: evn.data.type
            }
        }
        default: {
            console.log('hit default :-(')
        }
    }

}


function ExpConf(props) {

    const {
        name,
        num,
        type,
        context
    } = props.conf

    const { expand, apiorigin, conferencetypes } = props

    const { get, post, loading } = useFetch(apiorigin)

    const [state, dispatch] = useReducer(reducer, {
        mode: 'default',
        eName: name,
        eContext: context,
        eType: type,
        result: null
    })

    /* useEffect(() => {
        let  prevmode = state.mode
        if (loading) {
            dispatch({ e: 'modeswitch', data: 'loading' })
        } else {
            dispatch({e: 'modeswitch', data: prevmode})
        }
    }, [loading]) */

    function modconf() {
        let postbody = [{ num: num, context: state.eContext, type: state.eType }]
        if (state.eName.length > 0) {
            if (state.eName.includes(' ')) {
                dispatch({
                    e: 'editresult', data: {
                        done: [],
                        failed: [{
                            error: 'confnames may not contain whitespace',
                            conference: { name: 'novalid' }
                        }]
                    }
                })
                return
            } else {
                postbody[0].name = state.eName
            }
        }
        post('/api/conferences/mod', postbody)
            .then(data => {
                dispatch({ e: 'editresult', data: data })
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

    function delconf() {
        let postbody = [{ num: num }]
        post('/api/conferences/del', postbody)
            .then(data => {
                dispatch({ e: 'delresult', data: data })
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
                        <div><strong>modified conference:</strong></div>
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
                        <div>conference {state.result.failed[0].conference.name} unchanged.</div>
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
                        <div>conference {state.result.failed[0].conference.name} unchanged.</div>
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
                    <dt>Number:</dt>
                    <dd>{num}</dd>
                    <dt>Context:</dt>
                    <dd>{context}</dd>
                    <dt>Type:</dt>
                    <dd>{type}</dd>
                </dl>
                <div className={'expusract'}>
                    <CallBtn number={num} />
                    <span
                        className={'symb nocheck'}
                        onClick={() => dispatch({ e: 'modeswitch', data: 'edit' })}
                    >edit</span>
                    <span
                        className={'symb nocheck'}
                        onClick={() => dispatch({ e: 'modeswitch', data: 'askdel' })}
                    >delete</span>
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
                        onClick={() => delconf()}
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
                <div className={'expusract'}>
                    <span
                        className={'symb nockeck'}
                        onClick={() => dispatch({ e: 'resedit', data: props.conf })}
                    >replay</span>
                    <span
                        className={'symb nocheck'}
                        onClick={() => dispatch({ e: 'modeswitch', data: 'default' })}
                    >edit_off</span>
                    <span
                        className={'symb greencheck'}
                        onClick={() => modconf()}
                    >check</span>
                </div>
            </>)
        }
        default: {
            console.log('hit default :-(')
        }
    }

}

export default ExpConf;