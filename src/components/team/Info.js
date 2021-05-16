/**
 * render the info
 */

import { useContext } from 'react'
import User from './User'
import { XmlContext } from '../XmlContext'

//import './Info.css';


function Info() {

    const { xmlState } = useContext(XmlContext)

    if (xmlState) {
        return (
            <div>
                {
                    JSON.stringify(xmlState)
                }
            </div>
        )
    }
    return <p>Loading...</p>

}

export default Info;