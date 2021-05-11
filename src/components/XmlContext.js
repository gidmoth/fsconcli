/**
 * context to share xmlstate
 */

import { createContext, useState } from 'react'

// get context  object
const XmlContext = createContext()

// construct provider
function XmlProvider(props) {

    //  get a state for xmlstate
    const [xmlState, setXmlState] = useState()

    // renew xmlstate
    function newxml(data) {
        setXmlState(data.state)
    }

    const value = {
        xmlState: xmlState,
        newxml: newxml
    }

    return (
        <XmlContext.Provider value={value}>
            {props.children}
        </XmlContext.Provider>
    )
}

// export what is needed
export { XmlContext, XmlProvider }



