import './Phone.css';
import { useContext, useEffect, useRef } from 'react';
import { HeadContext } from './HeadContext'
import { PhoneContext } from './PhoneContext'

function Phone(props) {

    const { headstate } = useContext(HeadContext)
    const { phone, initPhone } = useContext(PhoneContext)
    const { user, apiorigin } =  props
    const mediaEl = useRef(null)

    useEffect(()  => {
        initPhone(user, apiorigin, mediaEl.current)
    }, [])


    // effects on states


    return (
        <div className={headstate.showphone ? 'Phone' : 'PhoneHidden'}>
            <audio controls ref={mediaEl}></audio>
        </div>
    );
}

export default Phone;