import './PhoneButtons.css';
import { useContext, useEffect, useState } from 'react';
import { PhoneContext } from './PhoneContext'



// the  call  button
function CallBtn(props) {

    const {
        phonestate,
        phonedispatch
    } = useContext(PhoneContext)

    const {
        number
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
                setMyClass('green disabled')
                break
            }
            default: {
                setMyClass('green')
                break
            }
        }
    }, [phonestate])

    function clickAct() {
        switch (true) {
            case phonestate.talking || phonestate.calling || phonestate.ringing: {
                console.log('clicked disabled green')
                break
            }
            default:
                phonedispatch({ type: 'immiset', value:  number })
                break
        }
    }

    return <span
        onClick={() => clickAct()}
        className={myClass}>
        call
    </span>
}


export default CallBtn;