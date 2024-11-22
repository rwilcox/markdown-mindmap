'use client'

import { useState, useEffect } from 'react'
import { getSession } from '@/utils/session'
import { UserHeader } from '@/app/components/UserHeader'
import { useRouter } from 'next/navigation'

import { DocumentListConnected } from './DocumentList'

export function Dynamic() {
  const router = useRouter()
  const [documentId, setDocumentId] = useState<null | string>(null)

  const jwt = getSession('TOKEN')

  function handleSignout() {
    router.push("/")
    // TODO: implement me
  }

  useEffect( () => {
    const params = new URLSearchParams(window.location.search)
    const paramsObj = Object.fromEntries(params.entries())
    const documentId: string | undefined = paramsObj.id
    if (documentId) { setDocumentId(documentId) } else { setDocumentId(null) }
  })

  // because Next.js does not support dynamic routes in statically generated pages
  // select the proper sub-component to display to the user
  // as the difference - an id key in the URL string - has been generated in the DocumentList
  // component
  // WD-rpw 11/19/2024
  return (
    <div>
      <UserHeader jwt={jwt} email={getSession("EMAIL")} handleSignout={handleSignout} />
      <div className="m-2">
        {!documentId && <DocumentListConnected />}
        {documentId && <div>implement me</div>}
        </div>
    </div>
  )
}
