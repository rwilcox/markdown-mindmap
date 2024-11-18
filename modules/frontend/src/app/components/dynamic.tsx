'use client'

import { useState } from 'react'
import { Amplify } from 'aws-amplify'
import { Env, getConfig } from "@/config"
import { Document } from "@/models/Document"
import { useRouter } from 'next/navigation'
import { getSession } from "@/utils/session"

import { Authentication } from './authentication'
import { SigninInfo } from './UserHeader'
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
export default function Dynamic( ) {
  const loggedIn = getSession("EMAIL") ? true : false

  const [showAuthentication, setShowAuthentication] = useState(!loggedIn)
  const [isAuthenticated, setIsAuthenticated] = useState(loggedIn)
  const [showAnonToggle, setShowAnonToggle] = useState(loggedIn)
  const [accessToken, setAccessToken] = useState<string | null>(getSession("TOKEN"))
  const [showEditor, setShowEditor] = useState(loggedIn)

  function handleToggleHideAuthentication() {
    setShowAuthentication(!showAuthentication)
    setShowEditor(!showEditor)
  }

  function handleSignin({jwt}: SigninInfo) {
    const accessJWT = jwt

    if (!isAuthenticated && accessJWT) {
      setAccessToken(jwt ?? "INVALID")

      setShowEditor(true)
      setShowAuthentication(false)
      setShowAnonToggle(false)

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


  async function handleDocumentSave(mStr: string, gvStr: string) {
    if (accessToken) {
      const currentDocument = new Document()
      currentDocument.currentEnv = Env.Beta  // TODO: use correct env
      currentDocument.markdownText = mStr
      currentDocument.graphvizText = gvStr
      currentDocument.title = "From Next" // TODO: use actual title
      const res = await currentDocument.saveDocument(accessToken!)

      console.log(res)
    }
  }

  function handleDocuments() {
    router.push("/documents")
  }

  const router = useRouter()

  return (
    <div>
        {showAnonToggle &&
          <button className="nativeBtn" onClick={handleToggleHideAuthentication}>Toggle Anonymous Mode</button>
        }
        <Authentication
          onSignIn={handleSignin}
          onSignOut={handleSignout}
          showAuthPanel={showAuthentication || isAuthenticated}/>
        { /* auth panel could be the Cognito component or could be signout */ }
        { isAuthenticated && <button className="nativeBtn"  onClick={handleDocuments}>List my documents</button> }

        {showEditor && <div className="mt-4">
                         <Editor isAuthenticated={isAuthenticated} handleSave={handleDocumentSave}/>
                       </div>
        }


   </div>
  )
}
