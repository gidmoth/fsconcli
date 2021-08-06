/**
 * render Infobox
 */

import  RegList from './RegList'
import ConfLive from './ConfLive'
import './InfoBox.css';


function MoniBox(props) {

    const {
        mode
    } = props


    switch (mode) {
        case 'registrations': {
            return (
                <div className={'infobox'}>
                    <div className={'infboxCont'}>
                        <RegList />
                    </div>
                </div>
            )
        }
        case 'conferences': {
            return (
                <div className={'infobox'}>
                    <div className={'infboxCont'}>
                        <ConfLive />
                    </div>
                </div>
            )
        }
        default: {
            return (
                <div className={'infobox'}>
                    {mode}
                </div>
            )
        }
    }
}

export default MoniBox;