import { useEffect, useState } from 'react'
import Conf from './Conf'
import ExpConf  from './ExpConf'
import './UserList.css'

function ConfList(props) {

    const [expanded, setExpanded] = useState(false)
    const [expconf, setExpuser] = useState(null)

    const {
        list,
        apiorigin,
        conferencetypes
    } = props

    function handleExpand(obj) {
        setExpanded(obj.truth)
        setExpuser(obj.data)
    }

    /* useEffect(() => {
        if (list.findIndex(elem => elem.id === expanded.id) === -1) {
            setExpanded({})
        }
    }, []) */

    switch (expanded) {
        case false: {
            return (
                <div className="UserList">
                    {list.map(conf => <Conf
                        conf={conf}
                        key={conf.num}
                        expand={handleExpand}
                    />)}
                </div>
            )
        }
        case true: {
            return (
                <div className='UserExpanded'>
                    <ExpConf
                        conf={expconf}
                        expand={handleExpand}
                        apiorigin={apiorigin}
                        conferencetypes={conferencetypes}
                    />
                </div>
            )
        }
        default: {
            console.log('hit default :-(')
        }
    }
}

export default ConfList;