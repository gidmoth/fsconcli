import './PhoneButtons.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { PhoneContext } from './PhoneContext'
import { XmlContext } from './XmlContext';


// the  call  button
function GreenBtn(props) {

    const {
        phonestate,
        answerCall,
        phonedispatch
    } = useContext(PhoneContext)

    const {
        dial,
        infoNum
    } = props

    const [myClass, setMyClass] = useState('green')

    useEffect(() => {
        switch (true) {
            case phonestate.talking: {
                setMyClass('green disabled')
                break
            }
            case phonestate.calling: {
                setMyClass('green disabled')
                break
            }
            case phonestate.ringing: {
                setMyClass('green')
                break
            }
            default: {
                setMyClass('green')
                break
            }
        }
    }, [phonestate, infoNum])

    function clickAct() {
        switch (true) {
            case phonestate.talking || phonestate.calling: {
                console.log('clicked disabled green')
                break
            }
            case phonestate.ringing: {
                answerCall()
                break
            }
            case infoNum.length > 0: {
                dial()
                break
            }
            default:
                phonedispatch({ type: 'togdtmf' })
                break
        }
    }

    return <span
        onClick={() => clickAct()}
        className={myClass}>
        call
    </span>
}


// the hangup button
function RedBtn(props) {

    const {
        phonestate,
        endCall
    } = useContext(PhoneContext)

    const { clearAll, infoNum } = props

    const [myClass, setMyClass] = useState('red disabled')

    useEffect(() => {
        switch (true) {
            case phonestate.talking || phonestate.calling || phonestate.ringing: {
                setMyClass('red')
                break
            }
            case infoNum.length > 0: {
                setMyClass('red')
                break
            }
            default: {
                setMyClass('red disabled')
                break
            }
        }
    }, [phonestate, infoNum])

    function clickAct() {
        switch (true) {
            case phonestate.talking || phonestate.calling || phonestate.ringing: {
                endCall()
                break
            }
            case infoNum.length > 0: {
                clearAll()
                break
            }
            default: {
                console.log('clicked disabled red')
                break
            }
        }
    }


    return <span
        onClick={() => clickAct()}
        className={myClass}>
        call_end
    </span>
}


// buttons  for numpad
function PadBtn(props) {

    const {
        sign,
        clickNum,
        dtmfSend
    } = props

    const {
        phonestate
    } = useContext(PhoneContext)

    const [myClass, setMyClass] = useState('PadBtn')

    useEffect(() => {
        switch (phonestate.dtmf) {
            case true: {
                setMyClass('PadBtn dtmf')
                break
            }
            case false: {
                setMyClass('PadBtn')
                break
            }
        }
    }, [phonestate.dtmf])

    function clickAct() {
        if (phonestate.dtmf) {
            dtmfSend(sign)
        } else {
            clickNum(sign)
        }
    }

    return <span
        onClick={() => clickAct()}
        className={myClass}>
        {sign}
    </span>
}

// the numpad
function Pad(props) {

    const {
        clickNum,
        showPad,
        dtmfSend
    } = props

    const [myClass, setMyClass] = useState('Pad')

    useEffect(() => {
        if (showPad) {
            setMyClass('Pad')
        } else {
            setMyClass('nodisp')
        }
    }, [showPad])


    return <div
        className={myClass}>
        <PadBtn sign='1' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='2' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='3' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='4' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='5' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='6' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='7' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='8' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='9' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='*' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='0' clickNum={clickNum} dtmfSend={dtmfSend} />
        <PadBtn sign='#' clickNum={clickNum} dtmfSend={dtmfSend} />
    </div>
}


// massages and  numbers
function InfoBox(props) {

    const { infoNum, clickClear } = props

    return (
        <div className={infoNum.length > 0 ? 'phoneInfo' : 'nodisp'}>
            <div className={'infonum'}>
                {infoNum}
            </div>
            <div
                className={'numclear'}
                onClick={clickClear}
            >backspace</div>
        </div>
    )
}

// toggle video button
function VidToggle(props) {

    const {
        phonestate
    } = useContext(PhoneContext)

    const {
        toggleVid
    } = props

    return (
        <span
            className={phonestate.calling ||
                phonestate.ringing ||
                phonestate.talking ?
                'nodisp' : 'subbtn'}
            onClick={() => toggleVid()}
        >
            {phonestate.video ? 'videocam_off' : 'videocam'}
        </span>
    )
}

// flip cam button
// toggle video button
function FlipCam(props) {

    const {
        phonestate
    } = useContext(PhoneContext)

    const {
        flipCam
    } = props

    return (
        <span
            className={phonestate.video ? 'subbtn' : 'nodisp'}
            onClick={() => flipCam()}
        >
            flip_camera_android
        </span>
    )
}

//toggle  Pad
function TogPad(props) {

    const {
        togPad
    } = props

    return (
        <span
            className={'subbtn'}
            onClick={() => togPad()}
        >
            dialpad
        </span>
    )
}

// passive Info
function PassInfoBox(props) {

    const { action, value, show } = props

    return (
        <div className={show ? 'passInfo' : 'nodisp'}>
            <div className={'passact'}>
                {action}
            </div>
            <div className={'passval'}>
                {value}
            </div>
        </div>
    )
}


// render all buttons
function PhoneButtons(props) {

    const [infoNum, setInfoNum] = useState('')
    const [showPad, setShowPad] = useState(true)
    const [pinfoVal, setPinfoVal] = useState('')
    const [pinfoAct, setPinfoAct] = useState('')
    const [showPinfo, setShowPinfo] = useState(false)

    const {
        phonedispatch,
        phonestate,
        answerCall,
        makeCall,
        endCall,
        sendDtmf
    } = useContext(PhoneContext)

    const {
        xmlState
    } = useContext(XmlContext)

    const {
        mediaEl,
        optmediaEl,
        toggleVid,
        flipCam
    } = props

    function getCallee(num) {
        if (xmlState.users.find(usr =>  usr.id === num) !== undefined) {
            return xmlState.users.find(usr =>  usr.id === num).name
        }
        if (xmlState.conferences.find(conf =>  conf.num === num) !== undefined) {
            return xmlState.conferences.find(conf =>  conf.num === num).name
        }
        return num
    }

    useEffect(() => {
        switch (true) {
            case phonestate.ringing: {
                setShowPad(false)
                setPinfoVal(`${phonestate.caller}`)
                setPinfoAct('call from')
                setShowPinfo(true)
                break
            }
            case phonestate.calling: {
                setShowPad(false)
                setPinfoVal(`${getCallee(phonestate.callee)}`)
                setPinfoAct('calling')
                setShowPinfo(true)
                break
            }
            case phonestate.talking: {
                setPinfoAct(`talking to ${pinfoVal}`)
                setPinfoVal('')
                break
            }
            case !phonestate.talking: {
                setPinfoVal('')
                setPinfoAct('')
                setShowPinfo(false)
                break
            }
            default:
                setPinfoVal('')
                setPinfoAct('')
                setShowPinfo(false)
        }
    }, [phonestate])



    function togPad() {
        setShowPad(prev => !prev)
    }

    function dial() {
        switch (phonestate.video) {
            case false: {
                makeCall(infoNum, mediaEl)
                setInfoNum('')
                break
            }
            case true: {
                makeCall(infoNum, mediaEl, optmediaEl)
                setInfoNum('')
                break
            }
            default: {
                console.log('DEFDIAL')
                break
            }
        }
    }

    function dtmfSend(sign) {
        switch (phonestate.video) {
            case false: {
                sendDtmf(sign, mediaEl)
                setInfoNum('')
                break
            }
            case true: {
                sendDtmf(sign, mediaEl, optmediaEl)
                setInfoNum('')
                break
            }
            default: {
                console.log('DEFDIAL')
                break
            }
        }
    }

    function clickNum(num) {
        setInfoNum(prev => `${prev}` + `${num}`)
    }

    function clickClear() {
        setInfoNum(prev => prev.slice(0, -1))
    }

    function clearAll() {
        setInfoNum('')
    }

    return (<>
        <PassInfoBox
            action={pinfoAct}
            value={pinfoVal}
            show={showPinfo}
        />
        <InfoBox
            infoNum={infoNum}
            clickClear={clickClear}
        />
        <Pad
            clickNum={clickNum}
            dtmfSend={dtmfSend}
            showPad={showPad}
        />
        <div className={'greenredline'}>
            <GreenBtn
                dial={dial}
                infoNum={infoNum}
            />
            <TogPad
                togPad={togPad}
            />
            <VidToggle
                toggleVid={toggleVid}
            />
            <FlipCam
                flipCam={flipCam}
            />
            <RedBtn
                clearAll={clearAll}
                infoNum={infoNum}
            />
        </div>
    </>)

    /* switch (phonestate.video) {
        case false: {
            return (<></>);
        }
        case true: {
            return (<></>);
        }
    } */

}

export default PhoneButtons;