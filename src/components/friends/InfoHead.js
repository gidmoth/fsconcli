/**
 * render Infoheadline
 */

import { useState } from 'react'
//import { XmlContext } from '../XmlContext'

import './InfoHead.css';


function InfoHead(props) {

    const {
        mode,
        handleModeChange
    } = props

    const [open, setOpen] = useState(false)

    function togMenu() {
        setOpen(prev => !prev)
    }

    function handleChoice(nmode) {
        handleModeChange(nmode)
        togMenu()
    }

    return (
        <div className={'infohead'}>
            <div
                className={'headchoice'}
                onClick={togMenu}
            >
                <span className={'infoheadline'}>{mode}</span>
                <span className={'symb'}>{open ? 'expand_less' : 'expand_more'}</span>
            </div>
            <div
                className={open ? 'infoselect' : 'nodisp'}
            >
                <span
                    className={mode === 'account' ? 'ihtxt noavail' : 'ihtxt'}
                    onClick={() => handleChoice('account')}
                >account</span>
                <span
                    className={mode === 'users' ? 'ihtxt noavail' : 'ihtxt'}
                    onClick={() => handleChoice('users')}
                >users</span>
                <span
                    className={mode === 'conferences' ? 'ihtxt noavail' : 'ihtxt'}
                    onClick={() => handleChoice('conferences')}
                >conferences</span>
                <span
                    className={mode === 'recordings' ? 'ihtxt noavail' : 'ihtxt'}
                    onClick={() => handleChoice('recordings')}
                >recordings</span>
            </div>
        </div>
    )
}

export default InfoHead;