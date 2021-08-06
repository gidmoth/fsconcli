/**
 * render a users
 */

import './Users.css';
import { useContext, useEffect, useReducer, useRef } from 'react'
import { XmlContext } from '../XmlContext'
import ConfList from './ConfList'


function uniquify(val, idx, arr) {
    return arr.findIndex(elem => elem.id === val.id) === idx
}

function getConfList(confs, ctxf, typef, filter) {
    let ctxret = []
    switch (ctxf) {
        case 'all': {
            ctxret = [...confs]
            break
        }
        case 'friends': {
            ctxret = confs.filter(conf => conf.context === 'friends')
            break
        }
        case 'public': {
            ctxret = confs.filter(conf => conf.context === 'public')
            break
        }
        default: {
            console.log('hit default :-(')
        }
    }

    let typeret = []
    switch (typef) {
        case 'all': {
            typeret = [...ctxret]
            break
        }
        default: {
            typeret = ctxret.filter(conf => conf.type === typef)
        }
    }

    if (filter === '') {
        return typeret
    }

    let namesmatch = typeret.filter(conf => conf.name.toLowerCase().includes(filter.toLowerCase()))
    let nummatch = typeret.filter(conf => conf.num.includes(filter))
    let retarr = [...namesmatch, ...nummatch]
    return retarr.filter(uniquify)
}


function reducer(currstate, evn) {
    switch (evn.e) {
        case 'filterchange': {
            return { ...currstate, filter: evn.data }
        }
        case 'newconflist': {
            return { ...currstate, conflist: evn.data }
        }
        case 'ctxfilterch': {
            return { ...currstate, ctxfilter: evn.data }
        }
        case 'typefilterch': {
            return { ...currstate, typefilter: evn.data }
        }
        case 'confsearch': {
            return (
                currstate.mode === 'search' ?
                    { ...currstate, filter: '', ctxfilter: 'all', typefilter: 'all' } :
                    { ...currstate, mode: 'search' }
            )
        }
        default: {
            console.log('hit default!')
        }
    }
}

function Conferences() {

    const { xmlState } = useContext(XmlContext)

    const { conferences, conferencetypes } = xmlState

    const searchRef = useRef()

    const [state, dispatch] = useReducer(reducer, {
        ctxfilter: 'all',
        typefilter: 'all',
        conflist: conferences,
        filter: '',
        mode: 'search'
    })

    useEffect(() => {
        dispatch({ e: 'newconflist', data: getConfList(conferences, state.ctxfilter, state.typefilter, state.filter) })
        if (state.filter === '') {
            searchRef.current.value = ''
        }
    }, [state.ctxfilter, state.filter, state.typefilter, conferences])

    function filterchange(evn) {
        dispatch({ e: 'filterchange', data: evn.target.value })
    }

    return (
        <>
            <div className={'usersmain'}>
                <div className={'usermenu'}>
                    <span
                        className={'symb'}
                        onClick={() => dispatch({ e: 'confsearch' })}
                    >
                        refresh
                     </span>
                </div>
                <div className={'searchbox'}>
                    <div className={'opttag'}><strong>Context:</strong></div>
                    <div>
                        <select
                            value={state.ctxfilter}
                            onChange={e => dispatch({ e: 'ctxfilterch', data: `${e.target.value}` })}
                        >
                            <option value='all'>all</option>
                            <option value='friends'>friends</option>
                            <option value='public'>public</option>
                        </select>
                    </div>
                    <div className={'opttag'}><strong>Type:</strong></div>
                    <div>
                        <select
                            value={state.typefilter}
                            onChange={e => dispatch({ e: 'typefilterch', data: `${e.target.value}` })}
                        >
                            <option value='all'>all</option>
                            {conferencetypes.map(type => <option value={type} key={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className={'opttag'}>
                        <strong>Search:</strong>
                    </div>
                    <div>
                        <input
                            type='text'
                            size='10'
                            ref={searchRef}
                            onChange={filterchange}
                        />
                    </div>
                    <div className={'opttag'}>
                        <strong>Matchcount:</strong>
                    </div>
                    <div>
                        {state.conflist.length}
                    </div>
                </div>
            </div>
            <div>
                <ConfList
                    list={state.conflist}
                />
            </div>
        </>
    )
}

export default Conferences;