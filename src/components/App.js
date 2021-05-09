/**
 * main component
 */

import './App.css';
import React, { useState, useEffect, Suspense } from 'react';

const TeamApp = React.lazy(() => import('./TeamApp'))

function App(props) {

    // get control states and setters
    const [access, setAccess] = useState('gathering')
    const [user, setUser] = useState({})

    // effect on states: get userinfo
    useEffect(() => {
        fetch(`${props.apiorigin}/userinfo`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setAccess(data.context)
                setUser(data)
            })
    }, [])

    // render according to usercontext
    switch (access) {
        case 'team': {
            return (
                <div className="App">
                    <Suspense fallback={<p>Loading...</p>}>
                        <TeamApp user={user} apiorigin={props.apiorigin}/>
                    </Suspense>
                </div>
            );
        }
        case 'gathering': {
            return (
                <div className="App">
                    <p>Gathering information...</p>
                </div>
            );
        }
        default: {
            return null
        }
    }
}

export default App;
