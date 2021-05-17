import './Phone.css';
import { useContext } from 'react';
import { HeadContext } from './HeadContext'
import { PhoneContext } from './PhoneContext'

function Phone(props) {

    const { headstate } = useContext(HeadContext)
    const { audioelem } = useContext(PhoneContext)

    // get control states and setters


    // effects on states


    return (
        <div className={headstate.showphone ? 'Phone' : 'PhoneHidden'}>
            {audioelem}
        </div>
    );
}

export default Phone;