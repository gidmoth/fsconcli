/**
 * render Infobox
 */

import  RegList from './RegList'
import './InfoBox.css';


function MoniBox(props) {

    const {
        mode,
        apiorigin
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
                        <div>showing confs</div>
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