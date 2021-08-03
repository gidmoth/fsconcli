/**
 * render a users
 */

import './Users.css';
import { useEffect, useReducer, useRef } from 'react'
import useFetch from './useFetch'

function reducer(currstate, evn) {
    switch (evn.e) {
        case 'filterchange': {
            return { ...currstate, filter: evn.data }
        }
        case 'newreclist': {
            return { ...currstate, reclist: evn.data }
        }
        case 'newall': {
            return { ...currstate, allrecs: evn.data.files }
        }
        default: {
            console.log('hit default!')
        }
    }
}

function getRecList(recs, filter) {
    if (filter === '') {
        return recs
    }
    return recs.filter(rec => rec.toLowerCase().includes(filter.toLowerCase()))
}

function Recordings(props) {

    const { apiorigin } = props

    const [state, dispatch] = useReducer(reducer, {
        filter: '',
        reclist: [],
        allrecs: []
    })

    const recsearchRef = useRef()

    const { get, post } = useFetch(apiorigin)

    function getRecs() {
        get('/api/recordings')
            .then(data => {
                dispatch({ e: 'newall', data: data })
                dispatch({ e: 'newreclist', data: getRecList(data.files, state.filter) })
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function filterchange(evn) {
        dispatch({ e: 'filterchange', data: evn.target.value })
    }

    function filterreset() {
        recsearchRef.current.value = ''
        dispatch({ e: 'filterchange', data: '' })
    }

    function recdel(rec) {
        post('/api/recordings/del', [{ file: rec }])
            .then(data => {
                console.log(data)
                getRecs()
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getRecs()
    }, [])

    useEffect(() => {
        dispatch({ e: 'newreclist', data: getRecList(state.allrecs, state.filter) })
    }, [state.filter])

    return (<>
        <div className={'usersmain'}>
            <div className={'usermenu'}>
                <span
                    className={'symb'}
                    onClick={getRecs}
                >
                    refresh
                </span>
                <span
                    className={'symb'}
                    onClick={filterreset}
                >
                    clear
                </span>
            </div>
            <div className={'searchbox'}>
                <div className={'opttag'}>
                    <strong>Search:</strong>
                </div>
                <div>
                    <input
                        type='text'
                        size='10'
                        onChange={filterchange}
                        ref={recsearchRef}
                    />
                </div>
                <div className={'opttag'}>
                    <strong>Matchcount:</strong>
                </div>
                <div>
                    {state.reclist.length}
                </div>
            </div>
        </div>
        <div className='reclist'>
            {state.reclist.map(rec => <div className='reclistitm' key={rec}>
                <div className='recnam'>
                    <a
                        href={apiorigin + '/api/recordings' + '/' + rec}
                        download={rec}
                    >{rec}</a>
                </div>
                <div className='recdel symb'>
                    <span
                        className='symb'
                        onClick={() => recdel(rec)}
                    >delete</span>
                </div>
            </div>)}
        </div>
    </>)
}

export default Recordings;