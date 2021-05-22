import './Phone.css';
import { useContext, useEffect, useRef } from 'react';
import { HeadContext } from './HeadContext'
import { PhoneContext } from './PhoneContext'

function Phone(props) {

    const { headdispatcher, headstate } = useContext(HeadContext)
    const {
        initPhone,
        registered,
        ringing,
        answerCall
    } = useContext(PhoneContext)
    const { user, apiorigin } = props
    const mediaEl = useRef(null)
    //const selfEl = useRef(null)

    // initialize audiophone by default
    useEffect(() => {
        initPhone(user, apiorigin, mediaEl.current)
    }, [])

    // react to ringstate (from Phonecontext)
    useEffect(() => {
        if (ringing) {
            headdispatcher({ type: 'phonering' })
        }
    },  [ringing])

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
                {registered ? <span>Registered</span> : <span>Registering...</span>}
                {ringing  ? <span
                className={'symb'}
                onClick={() => answerCall()}
                >call</span> : <span>nocall!</span>}
            </div>
        </div>
    );
}

export default Phone;