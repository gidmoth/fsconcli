/**
 * custom hook to call the fscon API when xmlState gets updated
 */

import { useState, useEffect } from 'react'
import useFetch from './useFetch'

function useGetXmlState(apiorigin, newxml) {

    // get control state and setter
    const [initXml, setInitXml] = useState(true)

    // useFetch things
    const { get, loading } = useFetch(apiorigin)

    // effect on context and state
    useEffect(() => {
        if (initXml) {
            get('/api/info/state')
                .then(data => {
                    console.log(data)
                    newxml(data)
                    setInitXml(false)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [initXml])

    // xmlchange handler
    function handleXmlChange() {
        setInitXml(true)
    }

    // return for calling component
    return {
        loading: loading,
        handleXmlChange: handleXmlChange
    }
}

export default useGetXmlState