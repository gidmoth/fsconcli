import './Phone.css';
import { useContext, useEffect, useRef } from 'react';
import { HeadContext } from './HeadContext'
import { PhoneContext } from './PhoneContext'

function Phone(props) {

    const { headstate } = useContext(HeadContext)
    const { phone, initPhone, registered } = useContext(PhoneContext)
    const { user, apiorigin } = props
    const mediaEl = useRef(null)
    const selfEl = useRef(null)

    useEffect(() => {
        initPhone(user, apiorigin, mediaEl.current, selfEl.current)
    }, [])


    // effects on states


    return (
        <div className={headstate.showphone ? 'Phone' : 'PhoneHidden'}>
            <div className={'PhoneInner'}>
                <audio
                    controls
                    ref={mediaEl}
                    // poster={`${apiorigin}/poster.png`}
                    className={'PhoneMedia'}
                ></audio>
                {registered ? <span>foo</span> : <span>Registering...</span>}
            </div>
        </div>
    );
}

export default Phone;