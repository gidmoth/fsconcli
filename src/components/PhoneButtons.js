import './PhoneButtons.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { PhoneContext } from './PhoneContext'


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
    }, [phonestate,  infoNum])

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

    const { sign, clickNum } = props

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
            console.log(`pad ${sign} clicked dtmf`)
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
        showPad
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
        <PadBtn sign='1' clickNum={clickNum} />
        <PadBtn sign='2' clickNum={clickNum} />
        <PadBtn sign='3' clickNum={clickNum} />
        <PadBtn sign='4' clickNum={clickNum} />
        <PadBtn sign='5' clickNum={clickNum} />
        <PadBtn sign='6' clickNum={clickNum} />
        <PadBtn sign='7' clickNum={clickNum} />
        <PadBtn sign='8' clickNum={clickNum} />
        <PadBtn sign='9' clickNum={clickNum} />
        <PadBtn sign='*' clickNum={clickNum} />
        <PadBtn sign='0' clickNum={clickNum} />
        <PadBtn sign='#' clickNum={clickNum} />
    </div>
}


// massages and  numbers
function InfoBox(props) {

    const { infoNum, clickClear } = props

    function getclearCls() {
        return (infoNum.length > 0 ? 'numclear' : 'nodisp')
    }

    function getinfoCls() {
        return (infoNum.length > 0 ? 'infonum' : 'nodisp')
    }

    return (
        <div className={'phoneInfo'}>
            <div className={getinfoCls()}>
                {infoNum}
            </div>
            <div
                className={getclearCls()}
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
            className={'subbtn'}
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
            onClick={() =>  togPad()}
        >
            dialpad
        </span>
    )
}


// render all buttons
function PhoneButtons(props) {

    const [infoNum, setInfoNum] = useState('')
    const [showPad, setShowPad] = useState(true)

    const {
        phonedispatch,
        phonestate,
        answerCall,
        makeCall,
        endCall,
    } = useContext(PhoneContext)

    const {
        mediaEl,
        optmediaEl,
        toggleVid,
        flipCam
    } = props

    useEffect(() => {
        console.log(`BtnContainer: ${JSON.stringify(phonestate)}`)
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
        <InfoBox
            infoNum={infoNum}
            clickClear={clickClear}
        />
        <Pad
            clickNum={clickNum}
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