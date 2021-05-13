/**
 * render appheader
 */

import './AppHeader.css';
import { useState, useEffect } from 'react';
import MPcontainer from './MPcontainer'
import Icon from '@material-ui/core/Icon'


function AppHeader(props) {

    // get control states and setters
    const [mpstate, setMpstate] = useState({
        collapsed: true,
        phone: false
    })

    // effects on states

    // destructure props
    const { switchMode, apiorigin } = props

    // mpstate updaters
    function handleMenuclick() {
        switch (mpstate.collapsed) {
            case true: {
                setMpstate({ collapsed: false, phone: false })
            }
            case false: {
                switch (mpstate.phone) {
                    case true: {
                        setMpstate({ collapsed: false, phone: false })
                    }
                    case false: {
                        setMpstate({ collapsed: true, phone: false })
                    }
                }
            }
        }
    }

    function handlePhoneClick() {
        switch (mpstate.collapsed) {
            case true: {
                setMpstate({ collapsed: false, phone: true })
            }
            case false: {
                switch (mpstate.phone) {
                    case true: {
                        setMpstate({ collapsed: true, phone: true })
                    }
                    case false: {
                        setMpstate({ collapsed: false, phone: true })
                    }
                }
            }
        }
    }

    // icon display deciders
    function meuBtnTxt() {
        switch (mpstate.collapsed) {
            case true: {
                return 'menu'
            }
            case false: {
                switch (mpstate.phone) {
                    case true: {
                        return 'menu'
                    }
                    case false: {
                        return 'expand_less'
                    }
                }
            }
        }
    }

    function phoneBtnTxt() {
        switch (mpstate.collapsed) {
            case true: {
                return 'phone_enabled'
            }
            case false: {
                switch (mpstate.phone) {
                    case true: {
                        return 'expand_less'
                    }
                    case false: {
                        return 'phone_enabled'
                    }
                }
            }
        }
    }

    const meubtn = meuBtnTxt()
    const phonebtn = phoneBtnTxt()

    return (
        <>
            <header className="App-header">
                <span className='meuBtn symb' onClick={handleMenuclick}>
                    <icon>{meubtn}</icon>
                </span>
                <span className='meuTitle'>
                    {`${apiorigin.split('//')[1].split('.')[0]}`}
                </span>
                <span className='phoneBtn symb' onClick={handlePhoneClick}>
                    <icon>{phonebtn}</icon>
                </span>
            </header>
            <MPcontainer />
        </>
    );
}

export default AppHeader;