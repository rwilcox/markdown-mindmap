import React from 'react';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import ReactDOM from 'react-dom';
import './index.css';
import EditorArea from './EditorArea';
import Header from './Header'

function userAuthenticatedSpace() {
    return withAuthenticator( EditorArea, )
}

Amplify.configure({
  Auth: {
    userPoolId: 'us-east-1_7SwoAY02u', // TODO: replace this with env variable
    region: 'us-east-1',
    userPoolWebClientId: '5cmu7esaum79r2h9u95piqa3tv' //TODO: replace this with env variable
  }
})

const AuthSpace = userAuthenticatedSpace()

ReactDOM.render(
  <React.StrictMode>
      <Header />
      <AuthSpace />
  </React.StrictMode>,
    ( ( document.getElementById('root') : any ): HTMLElement )
    // force bad type checking for ease of development. This potential runtime error is fine
    // WD-rpw 12/28/2020
);
