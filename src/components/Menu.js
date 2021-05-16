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
            <div className={mode === 'info' ? 'menuItemNa' : 'menuItem'} onClick={() => handleChoice('info')}>
                <p><span className='symb'>info</span><br />info</p>
            </div>
            <div className={mode === 'monitor' ? 'menuItemNa' : 'menuItem'} onClick={() => handleChoice('monitor')}>
                <p><span className='symb'>live_tv</span><br />monitor</p>
            </div>
        </div>
    );
}

export default Menu;