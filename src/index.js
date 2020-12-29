import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
    ( ( document.getElementById('root') : any ): HTMLElement )
    // force bad type checking for ease of development. This potential runtime error is fine
    // WD-rpw 12/28/2020
);
