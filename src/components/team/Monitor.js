/**
 * render the monitor
 */

import { useContext,  useState } from 'react'
//import { LiveContext } from '../LiveContext'
import './Info.css';
import MonHead from './MonHead'
import MoniBox from './MoniBox'


function Monitor(props) {

    const [mode, setMode] = useState('registrations')

    const { apiorigin } = props

    function handleModeChange(mode) {
        setMode(mode)
    }

    //const { liveState, dispatch } = useContext(LiveContext)


    return (
        <div className={'infocontainer'}>
            <MonHead
                handleModeChange={handleModeChange}
                mode={mode}
            />
            <MoniBox
                mode={mode}
                apiorigin={apiorigin}
            />
        </div>
    )
}

export default Monitor;
