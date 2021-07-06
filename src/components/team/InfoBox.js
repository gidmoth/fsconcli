/**
 * render Infobox
 */

import { useContext, useState } from 'react'
//import { XmlContext } from '../XmlContext'
import  Users from './Users'
import Conferences from './Conferences'
import Recordings from './Recordings'

import './InfoBox.css';


function InfoBox(props) {

    const {
        mode,
        user,
        apiorigin
    } = props

    function getPolyProv() {
        if (user.polymac === 'none') {
            return 'none'
        }
        return `https://${user.name}:${user.password}@${apiorigin.split('//')[1]}/polycom`
    }


    switch (mode) {
        case 'account': {
            return (
                <div className={'infobox'}>
                    <div className={'infboxCont'}>
                        <div className={'accountinfo'}>
                            <dl>
                                <dt>Name</dt>
                                <dd>{user.name}</dd>
                                <dt>Phone Number</dt>
                                <dd>{user.id}</dd>
                                <dt>email</dt>
                                <dd>{user.email}</dd>
                                <dt>Password</dt>
                                <dd>{user.password}</dd>
                                <dt>Context</dt>
                                <dd>{user.context}</dd>
                                <dt>Linphone Provisioning</dt>
                                <dd>
                                    {`https://${user.name}:${user.password}@${apiorigin.split('//')[1]}/linphone`}
                                </dd>
                                <dt>Polycom Provisioning</dt>
                                <dd>
                                    {getPolyProv()}
                                </dd>
                                <dt>Conference Pin</dt>
                                <dd>{user.conpin}</dd>
                                <dt>Polycom MAC</dt>
                                <dd>{user.polymac}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            )
        }
        case 'users': {
            return (
                <div className={'infobox'}>
                    <div className={'infboxCont'}>
                        <Users apiorigin={apiorigin}/>
                    </div>
                </div>
            )
        }
        case 'conferences': {
            return (
                <div className={'infobox'}>
                    <div className={'infboxCont'}>
                        <Conferences apiorigin={apiorigin}/>
                    </div>
                </div>
            )
        }
        case 'recordings': {
            return (
                <div className={'infobox'}>
                    <div className={'infboxCont'}>
                        <Recordings apiorigin={apiorigin}/>
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

export default InfoBox;