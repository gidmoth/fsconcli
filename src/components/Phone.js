import './Phone.css';
import { useContext, useEffect, useRef } from 'react';
import { HeadContext } from './HeadContext'
import { PhoneContext } from './PhoneContext'

function Phone(props) {

    const { headstate } = useContext(HeadContext)
    const { phone, initPhone, registered } = useContext(PhoneContext)
    const { user, apiorigin } = props
    const mediaEl = useRef(null)

    useEffect(() => {
        initPhone(user, apiorigin, mediaEl.current)
    }, [])


    // effects on states


    return (
        <div className={headstate.showphone ? 'Phone' : 'PhoneHidden'}>
            <div className={'PhoneInner'}>
                <video
                    controls
                    ref={mediaEl}
                    poster={`${apiorigin}/poster.png`}
                    className={'PhoneMedia'}
                ></video>
                {registered ? <span>foo</span> : <span>Registering...</span>}
            </div>
        </div>
    );
}

export default Phone;