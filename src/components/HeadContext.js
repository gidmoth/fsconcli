/**
 * context to share lifestate
 */

import { createContext, useReducer } from 'react'

// reducer for stateupdating
function reducer(currstate, event) {
    switch (event.type) {
        case 'menu': {
            switch (currstate.showphone) {
                case true: {
                    switch (currstate.menuicn) {
                        case 'menu': {
                            return {
                                ...currstate,
                                showmenu: true,
                                phoneicn: 'phone_enabled',
                                menuicn: 'close'
                            }
                        }
                        case 'close': {
                            return {
                                ...currstate,
                                showmenu: false,
                                phoneicn: 'expand_less',
                                menuicn: 'menu'
                            }
                        }
                    }
                }
                case false: {
                    switch (currstate.menuicn) {
                        case 'menu': {
                            return {
                                ...currstate,
                                showmenu: true,
                                menuicn: 'close'
                            }
                        }
                        case 'close': {
                            return {
                                ...currstate,
                                showmenu: false,
                                menuicn: 'menu'
                            }
                        }
                    }
                }
            }
            break
        }
        case 'phone': {
            switch (currstate.phoneicn) {
                case 'expand_less': {
                    return {
                        showphone: false,
                        showmenu: false,
                        phoneicn: 'phone_enabled',
                        menuicn: 'menu',
                    }
                }
                case 'phone_enabled': {
                    return {
                        showphone: true,
                        showmenu: false,
                        phoneicn: 'expand_less',
                        menuicn: 'menu'
                    }
                }
            }
        }
    }
}

// get context  object
const HeadContext = createContext()

// construct provider
function HeadProvider(props) {

    //  get a state for headstate
    const [headstate, dispatch] = useReducer(reducer, {
        showphone: false,
        showmenu: false,
        phoneicn: 'phone_enabled',
        menuicn: 'menu'
    })

    // things to get used by components
    const value = {
        headstate: headstate,
        headdispatcher: dispatch
    }

    return (
        <HeadContext.Provider value={value}>
            {props.children}
        </HeadContext.Provider>
    )
}

// export what is needed
export { HeadContext, HeadProvider }

