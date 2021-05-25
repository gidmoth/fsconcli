import './Phone.css';
import { useContext, useEffect, useRef } from 'react';
import { HeadContext } from './HeadContext'
import { PhoneContext } from './PhoneContext'

function Phone(props) {

    const { headdispatcher, headstate } = useContext(HeadContext)
    
    const {
        initPhone,
        phonedispatch,
        phonestate,
        answerCall,
        makeCall,
        endCall
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
        if (phonestate.pop) {
            headdispatcher({ type: 'phonering' })
            phonedispatch({type: 'popped'})
        }
    },  [phonestate.pop])

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
                {phonestate.registered ? <span>Registered</span> : <span>Registering...</span>}
                <button onClick={answerCall}>answer</button>
                <button onClick={() => makeCall(mediaEl.current)}>make call</button>
                <button onClick={endCall}>end call</button>
            </div>
        </div>
    );
}

export default Phone;