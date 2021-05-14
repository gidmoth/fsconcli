/**
 * render appheader
 */

import './AppHeader.css';
import { useState, useEffect, useReducer } from 'react';
import MPcontainer from './MPcontainer'


function reducer(state, action) {

    //'expand_less'
}


function AppHeader(props) {

    // get control states and setters
    const [mpstate, dispatch] = useReducer(reducer, {
        collapsed: true,
        show: 'menu',
        phoneicn: 'phone_enabled',
        menuicn: 'menu'
    })

    // destructure props
    const { switchMode, apiorigin } = props

    return (
        <div className='headcontainer'>
            <header className="App-header">
                <span className='meuBtn symb' onClick={() => dispatch({ type: 'menu' })}>
                    {mpstate.menuicn}
                </span>
                <span className='meuTitle'>
                    {`${apiorigin.split('//')[1].split('.')[0]}`}
                </span>
                <span className='phoneBtn symb' onClick={() => dispatch({ type: 'phone' })}>
                    {mpstate.phoneicn}
                </span>
            </header>
            <MPcontainer />
        </div>
    );
}

export default AppHeader;