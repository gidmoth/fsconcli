/**
 * render appheader
 */

import './AppHeader.css';
import { useContext } from 'react';
import MPcontainer from './MPcontainer'
import { HeadContext } from './HeadContext'

function AppHeader(props) {

    // get control states and setters
    const { headdispatcher, headstate } = useContext(HeadContext)

    // destructure props
    const { switchMode, apiorigin, mode, user } = props

    return (
        <div className='headcontainer'>
            <header className="App-header">
                <span className='meuBtn symb' onClick={() => headdispatcher({ type: 'menu' })}>
                    {headstate.menuicn}
                </span>
                <span className='meuTitle'>
                    {`${apiorigin.split('//')[1].split('.')[0]}`}
                </span>
                <span className='phoneBtn symb' onClick={() => headdispatcher({ type: 'phone' })}>
                    {headstate.phoneicn}
                </span>
            </header>
            <MPcontainer
                switchMode={switchMode}
                mode={mode}
                user={user}
                apiorigin={apiorigin}
            />
        </div>
    );
}

export default AppHeader;