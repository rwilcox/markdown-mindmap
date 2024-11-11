'use client'

import { useState, useEffect } from 'react'

import { signOut, fetchUserAttributes, fetchAuthSession, JWT } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { Authenticator } from '@aws-amplify/ui-react'


import '@aws-amplify/ui-react/styles.css';

export type SigninInfo = {
  email: string;
  tokens?: {idToken?: JWT, accessToken?: JWT };
}

export type AuthenticationProps = {
  onSignIn: (arg0: SigninInfo) => void;
  onSignOut: () => void;
  showAuthPanel: boolean
}

export function Authentication(props: AuthenticationProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userEmail, setUserEmail] = useState('')

  const handleSignout = async () => {
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

    if (props.onSignIn) { props.onSignIn({email: (attributes.email ?? ""), tokens: sessionInfo.tokens}) }
  }

  useEffect( () => {
    Hub.listen('auth', ({payload: { event: data}}) => {
      switch(data) {
        case 'signedIn': { handleSignin() }
        case 'signedOut': { handleDidSignout() }
      }
    })
  })

  return (
    <div>
      {props.showAuthPanel && <Authenticator>
          <div>
            <button className="nativeBtn" type="button" onClick={handleSignout}>Sign Out</button>
          </div>
      </Authenticator>}
    </div>
   )
}
