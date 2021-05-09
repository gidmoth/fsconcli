/**
 * render appheader
 */

import './AppHeader.css';
import { useState, useEffect } from 'react';

function AppHeader(props) {

    // get control states and setters

    // effects on states


    return (
        <header className="App-header">
            <p>
                {`fsconcli on ${window.location.origin}`}
            </p>
        </header>
    );
}

export default AppHeader;