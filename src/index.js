/**
 * renderer
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App'

const  apiorigin = 'https://host.example.com'

ReactDOM.render(
  <React.StrictMode>
    <App apiorigin={apiorigin}/>
  </React.StrictMode>,
  document.getElementById('root')
);
