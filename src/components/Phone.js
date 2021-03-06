import './Phone.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { HeadContext } from './HeadContext'
import { PhoneContext } from './PhoneContext'
import PhoneButtons from './PhoneButtons'

function Phone(props) {

    const { headdispatcher, headstate } = useContext(HeadContext)

    const [showself, setShowself] = useState(false)

    const {
        initPhone,
        phonedispatch,
        phonestate,
        makeCall
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

    // react to callbtn
    useEffect(() => {
        if  (phonestate.immicall !== '') {
            makeCall(phonestate.immicall, mediaEl.current, optmediaEl.current)
            phonedispatch({ type: 'immiclear' })
            headdispatcher({ type: 'phonering' })
        }
    }, [phonestate.immicall])

    // toggle Video
    function toggleVid() {
        phonedispatch({ type: 'togglevid' })
    }

    // flip cam
    function flipCam() {
        setShowself(!showself)
    }

    // effects on states

    switch (phonestate.video) {
        case false: {
            return (<>
                <div className={headstate.showphone ? 'Phone' : 'PhoneHidden'}>
                    <audio
                        ref={mediaEl}
                        className={'PhoneMediaAud'}
                    ></audio>
                </div>
                <div className={headstate.showphone ? 'PhoneButtons' : 'PhoneButtonsHidden'}>
                    <PhoneButtons
                        mediaEl={mediaEl.current}
                        optmediaEl={optmediaEl.current}
                        toggleVid={toggleVid}
                        flipCam={flipCam}
                    />
                </div>
            </>);
        }
        case true: {
            return (<>
                <div className={headstate.showphone ? 'Phone' : 'PhoneHidden'}>
                    <video
                        ref={mediaEl}
                        poster={`${apiorigin}/poster.png`}
                        className={showself ? 'PhoneMediaVidHidden' : 'PhoneMediaVid'}
                    ></video>
                    <video
                        ref={optmediaEl}
                        poster={`${apiorigin}/poster.png`}
                        className={showself ? 'PhoneMediaVid' : 'PhoneMediaVidHidden'}
                    ></video>
                </div>
                <div className={headstate.showphone ? 'PhoneButtons' : 'PhoneButtonsHidden'}>
                    <PhoneButtons
                        mediaEl={mediaEl.current}
                        optmediaEl={optmediaEl.current}
                        toggleVid={toggleVid}
                        flipCam={flipCam}
                    />
                    {/* {phonestate.registered ? <span>Registered</span> : <span>Registering...</span>}
                    <button onClick={answerCall}>answer</button>
                    <button onClick={() => makeCall(mediaEl.current)}>make call</button>
                    <button onClick={endCall}>end call</button>
                    <button onClick={() => toggleVid()}>toggle video</button>
                    <button onClick={() => flipCam()}>flip  cam</button> */}
                </div>
            </>);
        }
    }

}

export default Phone;