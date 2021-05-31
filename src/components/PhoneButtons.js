import './PhoneButtons.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { PhoneContext } from './PhoneContext'
import { CollectionsBookmarkOutlined } from '@material-ui/icons';

function GreenBtn(props) {

    const {
        phonestate,
        answerCall,
        makeCall
    } = useContext(PhoneContext)

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
        }
    }

    return <span
        onClick={() => clickAct()}
        className={getClass()}>
        call
    </span>
}

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


function PhoneButtons(props) {

    const [infoNum, setInfoNum] = useState('')

    const {
        phonedispatch,
        phonestate,
        answerCall,
        makeCall,
        endCall
    } = useContext(PhoneContext)

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
            <GreenBtn />
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