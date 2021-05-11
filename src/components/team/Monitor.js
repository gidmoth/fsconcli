/**
 * render the monitor
 */

import { useContext } from 'react'
import { LiveContext } from '../LiveContext'

//import './Info.css';


function Monitor() {

    const { liveState, dispatch } = useContext(LiveContext)


    return (
        <div>
            {
                JSON.stringify(liveState)
            }
        </div>
    )
}

export default Monitor;