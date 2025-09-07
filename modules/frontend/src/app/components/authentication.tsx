'use client'

import { useState, useEffect } from 'react'

import { signOut, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { Authenticator } from '@aws-amplify/ui-react'
import { SigninInfo, UserHeader } from './UserHeader'
import { getSession, clearSession, createSession } from '@/utils/session'
import '@aws-amplify/ui-react/styles.css';


export type AuthenticationProps = {
  onSignIn: (arg0: SigninInfo) => void;
  onSignOut: () => void;
  showAuthPanel: boolean
}


/**
Authentication is abstracted by this component. It allows consumer to
register callback functions for signin / signout, but also stores the
given JWT in localStorage.getItem("jwtToken")
*/
export function Authentication(props: AuthenticationProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userEmail, setUserEmail] = useState('')
  const [jwtTokenComponentState, setJwtTokenComponentState] = useState(getSession('TOKEN'))

  const handleSignout = async () => {
    clearSession()

    setJwtTokenComponentState("")
    if (props.onSignOut) { props.onSignOut() }
    signOut()
  }

  const handleDidSignout = async () => {
    setUserEmail("")
  }

  const handleSignin = async () => {

    const attributes = await fetchUserAttributes()
    const sessionInfo = await fetchAuthSession()

    setUserEmail(attributes.email ?? "")

    // access vs id tokens
    // https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html#user-pool-settings-client-app-token-types
    // you want the ID token!!! not .accessToken! WD-rpw 11-08-2024
    const jwt = sessionInfo?.tokens?.idToken?.toString() ?? ""
    createSession(jwt, (attributes?.email) ?? "")
    setJwtTokenComponentState(jwt) // mostly for refresh properties

    if (props.onSignIn) { props.onSignIn({email: (attributes.email ?? ""), jwt}) }
  }

  useEffect( () => {
    Hub.listen('auth', ({payload: { event: data}}) => {
      switch(data) {
        case 'signedIn': { handleSignin() }
        case 'signedOut': { handleDidSignout() }
      }
    })
  })

  return ( <div>
      {props.showAuthPanel && <Authenticator />}
       <UserHeader email={userEmail} handleSignout={handleSignout} jwt={jwtTokenComponentState ?? ""} />
    </div>
   )
}
