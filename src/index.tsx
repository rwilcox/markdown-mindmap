import React from 'react';
import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import ReactDOM from 'react-dom';
import './index.css';

import AuthenticatedSpace from './AuthenticatedSpace'
import UnauthenticatedSpace from './UnauthenticatedSpace'

import Header from './Header'

function userAuthenticatedSpace() {
    return withAuthenticator(AuthenticatedSpace, )
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
    <UnauthenticatedSpace />
    <AuthSpace />

  </React.StrictMode>,
   document.getElementById('root')
)
