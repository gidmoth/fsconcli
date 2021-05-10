/**
 * custom hook to call the fscon API when xmlState gets updated
 */

import { useState, useEffect } from 'react'
import useFetch from './useFetch'

function useGetXmlState(apiorigin) {

    // get control states and setters
    const [initXml, setInitXml] = useState(true)
    const [xmlState, setXmlState] = useState()

    // useFetch things
    const { get, loading } = useFetch(apiorigin)

    // effects on states
    useEffect(() => {
        if (initXml) {
            get('/api/info/state')
                .then(data => {
                    console.log(data)
                    setXmlState(data)
                    setInitXml(false)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [initXml])

    // variables for xmlState destructuring
    let info, globals, users, conferencetypes, conferences

    // conditional xmlState destructuring
    if (xmlState) {
        ({ info, globals, users, conferencetypes, conferences } = xmlState.state)
    }

    // xmlchange handler
    function handleXmlChange() {
        setInitXml(true)
    }

    // return for calling component
    return {
        loading: loading,
        info: info,
        globals: globals,
        users: users,
        conferencetypes: conferencetypes,
        conferences: conferences,
        handleXmlChange: handleXmlChange
    }
}

export default useGetXmlState