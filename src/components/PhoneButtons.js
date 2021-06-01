import './PhoneButtons.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { PhoneContext } from './PhoneContext'


// the  call  button
function GreenBtn(props) {

    const {
        phonestate,
        answerCall
    } = useContext(PhoneContext)

    const {
        dial
    } = props

    function getClass() {
        return (
            phonestate.talking ||
                phonestate.calling ?
                'green disabled' : 'green'
        )
    }

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
            default:
                dial()
                break
        }
    }

    return <span
        onClick={() => clickAct()}
        className={getClass()}>
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

    function getClass() {
        switch (true) {
            case phonestate.talking || phonestate.calling || phonestate.ringing: {
                return 'red'
            }
            case !phonestate.talking && !phonestate.calling && !phonestate.ringing: {
                switch (true) {
                    case infoNum.length > 0: {
                        return 'red'
                    }
                    default: {
                        return 'red disabled'
                    }
                }
            }
        }

    }

    function clickAct() {
        switch (true) {
            case phonestate.talking || phonestate.calling || phonestate.ringing: {
                endCall()
                break
            }
            case !phonestate.talking && !phonestate.calling && !phonestate.ringing: {
                switch (true) {
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
        }
    }

    return <span
        onClick={() => clickAct()}
        className={getClass()}>
        call_end
    </span>
}


// buttons  for numpad
function PadBtn(props) {

    const { sign, clickNum } = props

    const {
        phonestate
    } = useContext(PhoneContext)

    function getClass() {
        return (phonestate.dtmf ? 'PadBtn dtmf' : 'PadBtn')
    }

    function clickAct() {
        if (phonestate.dtmf) {
            console.log(`pad ${sign} clicked dtmf`)
        } else {
            clickNum(sign)
        }
    }

    return <span
        onClick={() => clickAct()}
        className={getClass()}>
        {sign}
    </span>
}

// the numpad
function Pad(props) {

    const { clickNum } = props

    const {
        phonestate
    } = useContext(PhoneContext)

    function getClass() {
        return ('Pad')
    }

    return <div
        className={getClass()}>
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


// render all buttons
function PhoneButtons(props) {

    const [infoNum, setInfoNum] = useState('')

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
        }
        makeCall(infoNum, mediaEl)
        setInfoNum('')
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
        <Pad clickNum={clickNum} />
        <div className={'greenredline'}>
            <GreenBtn
                dial={dial}
                infoNum={infoNum}
            />
            <RedBtn
                clearAll={clearAll}
                infoNum={infoNum}
            />
        </div>
        <div className={'subline'}>
            <VidToggle
                toggleVid={toggleVid}
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