'use client'

import { useState } from 'react'
import { Amplify } from 'aws-amplify'
import { getConfig } from "@/config"
import { Env, Document } from "@/models/Document"

import { Authentication } from './authentication'
import { Editor } from './Editor'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: getConfig('AMPLIFY_WEBCLIENT_ID'),
      userPoolId: getConfig('AMPLIFY_USERPOOL_ID')
    }
  }
})

/**
  Dynamic is the root component of all authenticated actions. It keeps track of all user state
  and passes information down to authentication using components if required.
*/
export function Dynamic() {
  const [showAuthentication, setShowAuthentication] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAnonToggle, setShowAnonToggle] = useState(true)
  const [accessToken, setAccessToken] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [email, setEmail] = useState("")

  function handleToggleHideAuthentication() {
    setShowAuthentication(!showAuthentication)
    setShowEditor(!showEditor)
  }

  function handleSignin({email, jwt}) {
    if (!isAuthenticated) {
      // access vs id tokens
      // https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html#user-pool-settings-client-app-token-types
      setAccessToken(jwt?.idToken?.toString()) // you want the ID token!!! not .accessToken! WD-rpw 11-08-2024

      setShowEditor(true)
      setShowAuthentication(false)
      setShowAnonToggle(false)
      setEmail(email)
      setIsAuthenticated(true)
    }
  }

  function handleSignout() {
    if (isAuthenticated) {
      setShowEditor(false)
      setShowAuthentication(true)
      setShowAnonToggle(true)
      setIsAuthenticated(false)
    }
  }

  async function handleListDocuments() {
    const documents = await Document.getDocuments(accessToken, Env.Beta)
    // TODO: show clever interface
    console.log(documents)
  }

  function displayDocumentList() {
      if (!isAuthenticated) { return <span></span> }

      return <div className="mt-4">
             <button className="nativeBtn" onClick={handleListDocuments}>List Documents</button>
              </div>
  }

  async function handleDocumentSave(mStr: string, gvStr: string) {
    const currentDocument = new Document()
    currentDocument.currentEnv = Env.Beta  // TODO: use correct env
    currentDocument.markdownText = mStr
    currentDocument.title = "From Next" // TODO: use actual title
    const res = await currentDocument.saveDocument(accessToken)

    console.log(res)
  }

  return (
    <div>
        {showAnonToggle &&
          <button className="nativeBtn" onClick={handleToggleHideAuthentication}>Toggle Anonymous Mode</button>
        }
        {isAuthenticated && <p>Welcome, {email}</p>}
        <Authentication
          onSignIn={handleSignin}
          onSignOut={handleSignout}
          showAuthPanel={showAuthentication || isAuthenticated}/>
        { /* auth panel could be the Cognito component or could be signout */ }

        {displayDocumentList()}
        {showEditor && <div className="mt-4">
                         <Editor isAuthenticated={isAuthenticated} handleSave={handleDocumentSave}/>
                       </div>
        }


   </div>
  )
}
