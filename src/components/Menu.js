import './Menu.css';
import { useContext } from 'react';
import { HeadContext } from './HeadContext'

function Menu(props) {

    const { headstate } = useContext(HeadContext)

    // get control states and setters
    

    // effects on states


    return (
        <div className={headstate.showmenu ? 'Menu' : 'MenuHidden'}>
            <p>
                Placeholder for Menu<br/>
                {headstate.showmenu && 'im visible!'}
            </p>
        </div>
    );
}

export default Menu;