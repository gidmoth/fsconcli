import './MPcontainer.css';
import Phone from './Phone'
import Menu from './Menu'

function MPcontainer(props) {

    const { switchMode, mode, user, apiorigin } = props

    return (
        <div className="MPcontainer">
            <Menu switchMode={switchMode} mode={mode} />
            <Phone user={user} apiorigin={apiorigin} />
        </div>
    );
}

export default MPcontainer;