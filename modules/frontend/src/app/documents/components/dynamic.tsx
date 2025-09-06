'use client'

import { useState, useEffect } from 'react'
import { getSession } from '@/utils/session'
import { UserHeader } from '@/app/components/UserHeader'
import { useRouter } from 'next/navigation'

import { DocumentListConnected } from './DocumentList'
import { DocumentEditorConnected } from './DocumentEditor'


export function Dynamic() {
  const router = useRouter()
  const [documentId, setDocumentId] = useState<null | string>(null)
  const [jwt, setJwt] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [isHydrated, setIsHydrated] = useState(false)

  function handleSignout() {
    router.push("/")
    // TODO: implement me
  }

  useEffect( () => {
    // Handle hydration
    setIsHydrated(true)
    
    // Get session data on client-side only
    setJwt(getSession('TOKEN'))
    setEmail(getSession('EMAIL'))
    
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search)
    const paramsObj = Object.fromEntries(params.entries())
    const documentId: string | undefined = paramsObj.id
    if (documentId) { setDocumentId(documentId) } else { setDocumentId(null) }
  }, [])

  function displayListOrEditor() {
    if (documentId) {
      return <DocumentEditorConnected documentId={documentId} />
    } else {
      return <DocumentListConnected />
    }
  }

  // because Next.js does not support dynamic routes in statically generated pages
  // select the proper sub-component to display to the user
  // as the difference - an id key in the URL string - has been generated in the DocumentList
  // component
  // WD-rpw 11/19/2024
  
  // Show loading state until hydration is complete
  if (!isHydrated) {
    return (
      <div>
        <div className="m-2">Loading...</div>
      </div>
    )
  }
  
  return (
    <div>
      <UserHeader jwt={jwt} email={email} handleSignout={handleSignout} />
      <div className="m-2">
        {displayListOrEditor()}
        </div>
    </div>
  )
}
