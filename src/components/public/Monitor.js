/**
 * render the monitor
 */

import { useState } from 'react'
//import { LiveContext } from '../LiveContext'
import './Info.css';
import MonHead from './MonHead'
import MoniBox from './MoniBox'


function Monitor(props) {

    const { apiorigin } = props

    //const { liveState, dispatch } = useContext(LiveContext)


    return (
        <div className={'infocontainer'}>
            <MonHead />
            <MoniBox
                apiorigin={apiorigin}
            />
        </div>
    )
}

export default Monitor;
