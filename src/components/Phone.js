import './Phone.css';
import { useContext } from 'react';
import { HeadContext } from './HeadContext'

function Phone(props) {

    const { headstate } = useContext(HeadContext)

    // get control states and setters


    // effects on states


    return (
        <div className={headstate.showphone ? 'Phone' : 'PhoneHidden'}>
            <p>
                Placeholder for Phone<br />
                {headstate.showphone && 'im visible!'}
            </p>
        </div>
    );
}

export default Phone;