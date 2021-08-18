/**
 * renderer
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App'

const  apiorigin = window.location.origin

ReactDOM.render(
  <React.StrictMode>
    <App apiorigin={apiorigin}/>
  </React.StrictMode>,
  document.getElementById('root')
);
