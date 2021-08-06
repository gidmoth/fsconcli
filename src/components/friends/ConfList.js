import { useState } from 'react'
import Conf from './Conf'
import './UserList.css'

function ConfList(props) {

    const {
        list
    } = props

    /* useEffect(() => {
        if (list.findIndex(elem => elem.id === expanded.id) === -1) {
            setExpanded({})
        }
    }, []) */

    return (
        <div className="UserList">
            {list.map(conf => <Conf
                conf={conf}
                key={conf.num}
            />)}
        </div>
    )

}

export default ConfList;