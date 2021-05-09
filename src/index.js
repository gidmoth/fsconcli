/**
 * renderer
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App'

const  apiorigin = 'https://gsphone.c8h10n4o2.gs'

ReactDOM.render(
  <React.StrictMode>
    <App apiorigin={apiorigin}/>
  </React.StrictMode>,
  document.getElementById('root')
);
