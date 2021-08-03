/**
 * render the info
 */

import { useContext, useState } from 'react'
import { XmlContext } from '../XmlContext'
import InfoHead from './InfoHead'
import InfoBox from './InfoBox'
import './Info.css';


function Info(props) {

    const { xmlState } = useContext(XmlContext)

    const [mode, setMode] = useState('account')

    const { user, apiorigin } =  props

    function handleModeChange(mode) {
        setMode(mode)
    }

    if (xmlState) {
        return (
            <div className={'infocontainer'}>
                <InfoHead
                    handleModeChange={handleModeChange}
                    mode={mode}
                />
                <InfoBox
                    mode={mode}
                    user={user}
                    apiorigin={apiorigin}
                />
            </div>
        )
    }
    return <p>Loading...</p>

}

export default Info;