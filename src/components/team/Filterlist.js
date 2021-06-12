/**
 * render filtered  list
 */

import './Users.css';
import User from './User'
import { useContext, useEffect, useReducer } from 'react'
import { XmlContext } from '../XmlContext'

function getFilterList(users, ctxf) {

}


function reducer(currstate, evn) {
    switch (evn.e) {
        case 'ctxfilterch': {
            return { ...currstate }
        }
        default: {
            console.log('hit default!')
        }
    }
}

function Filterlist(props) {

    const { list, hide, filter } = props

    const [state, dispatch] = useReducer(reducer, {

    })

    useEffect(() => {

    }, [])

    return (
        <div className={hide ? 'nodisp' : 'users'}>
            FILTER
        </div>
    )
}

export default Filterlist;