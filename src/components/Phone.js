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
    const optmediaEl = useRef(null)

    // initialize audiophone by default
    useEffect(() => {
        initPhone(user, apiorigin, mediaEl.current, optmediaEl.current)
    }, [phonestate.video])

    // react to ringstate (from Phonecontext)
    useEffect(() => {
        if (phonestate.pop) {
            headdispatcher({ type: 'phonering' })
            phonedispatch({ type: 'popped' })
        }
    }, [phonestate.pop])

    // toggle Video
    function toggleVid() {
        phonedispatch({type: 'togglevid'})
    }

    // effects on states

    switch (phonestate.video) {
        case false: {
            return (
                <div className={headstate.showphone ? 'Phone' : 'PhoneHidden'}>
                    <div className={'PhoneInner'}>
                        <audio
                            controls
                            ref={mediaEl}
                            className={'PhoneMedia'}
                        ></audio>
                        {phonestate.registered ? <span>Registered</span> : <span>Registering...</span>}
                        <button onClick={answerCall}>answer</button>
                        <button onClick={() => makeCall(mediaEl.current)}>make call</button>
                        <button onClick={endCall}>end call</button>
                        <button onClick={() => toggleVid()}>toggle video</button>
                    </div>
                </div>
            );
        }
        case true: {
            return (
                <div className={headstate.showphone ? 'Phone' : 'PhoneHidden'}>
                    <div className={'PhoneInner'}>
                        <video
                            controls
                            ref={mediaEl}
                            poster={`${apiorigin}/poster.png`}
                            className={'PhoneMedia'}
                        ></video>
                        <video
                            controls
                            ref={optmediaEl}
                            poster={`${apiorigin}/poster.png`}
                            className={'PhoneMedia'}
                        ></video>
                        {phonestate.registered ? <span>Registered</span> : <span>Registering...</span>}
                        <button onClick={answerCall}>answer</button>
                        <button onClick={() => makeCall(mediaEl.current)}>make call</button>
                        <button onClick={endCall}>end call</button>
                        <button onClick={() => toggleVid()}>toggle video</button>
                    </div>
                </div>
            );
        }
    }

}

export default Phone;