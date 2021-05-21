import './Menu.css';
import { useContext } from 'react';
import { HeadContext } from './HeadContext'

function Menu(props) {

    const { headstate, headdispatcher } = useContext(HeadContext)
    const { switchMode, mode } = props

    function handleChoice(choice) {
        switchMode(choice)
        headdispatcher({ type: 'menu' })
    }

    return (
        <div className={headstate.showmenu ? 'Menu' : 'MenuHidden'}>
            <div className={mode === 'info' ? 'menuItemNa' : 'menuItem'}>
                <p><span className='symb' onClick={() => handleChoice('info')}>info</span><br />info</p>
            </div>
            <div className={mode === 'monitor' ? 'menuItemNa' : 'menuItem'} >
                <p><span className='symb' onClick={() => handleChoice('monitor')}>live_tv</span><br />monitor</p>
            </div>
        </div>
    );
}

export default Menu;