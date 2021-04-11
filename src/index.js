import React from 'react';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Header from './Header'

Amplify.configure({
  Auth: {
    userPoolId: 'us-east-1_7SwoAY02u', // TODO: replace this with env variable
    region: 'us-east-1',
    userPoolWebClientId: '73pp6kcka3e4vt1cnt6plporge' //TODO: replace this with env variable
  }
})

ReactDOM.render(
  <React.StrictMode>
        <Header />
        <AmplifyAuthenticator />
  // <App />
  </React.StrictMode>,
    ( ( document.getElementById('root') : any ): HTMLElement )
    // force bad type checking for ease of development. This potential runtime error is fine
    // WD-rpw 12/28/2020
);
