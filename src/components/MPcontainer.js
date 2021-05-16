import './MPcontainer.css';
import { useState, useEffect } from 'react';
import Phone from './Phone'
import Menu from './Menu'

function MPcontainer(props) {

    const { switchMode,  mode } = props

    return (
        <div className="MPcontainer">
            <Menu switchMode={switchMode} mode={mode}/>
            <Phone />
        </div>
    );
}

export default MPcontainer;