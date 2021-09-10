/**
 * render Infobox
 */

import ConfLive from './ConfLive'
import './InfoBox.css';


function MoniBox(props) {


    return (
        <div className={'infobox'}>
            <div className={'infboxCont'}>
                <ConfLive />
            </div>
        </div>
    )

}

export default MoniBox;