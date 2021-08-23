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

type State = {
  inUnauthSpace: boolean
}

class App extends React.Component {
    state : State = {
        inUnauthSpace : true
    }

    _handleUnauthToggled = (unauthStatus: boolean) => {
      this.setState( {inUnauthSpace: unauthStatus} )
    }

    render() {
      return <React.StrictMode>
    <Header />
    <UnauthenticatedSpace onAuthenticated={this._handleUnauthToggled} />
    { this.state.inUnauthSpace ? <AuthSpace /> : <span></span> }

  </React.StrictMode>
    }
}

ReactDOM.render(
   <App />,
   document.getElementById('root')
)
