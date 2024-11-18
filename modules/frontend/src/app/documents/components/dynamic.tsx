'use client'

import { useState, useEffect } from 'react'
import { Env } from '@/config'
import { getSession } from '@/utils/session'

import { UserHeader } from '@/app/components/UserHeader'
import { useRouter } from 'next/navigation'
import { Document } from '@/models/Document'

export function Dynamic({documents}: {documents: Document[]}) {
  const router = useRouter()
  // const [documentList, setDocumentList] = useState([])

  const jwt = getSession('TOKEN')

  function handleSignout() {
    router.push("/")
    // TODO: implement me
  }

  function displayDocumentList(documents: Document[]) {
    return (
      <table className="table bg-white border border-gray-300">
        <thead className="border-b blue-50">
          <tr><td>Document Name</td></tr>
        </thead>
        <tbody>
        {documents?.map( (current, key) => (
          <tr className="table-row" key={`doc-${key}`}>
            <td className="border-b gray-50">
              <a href={`/documents/${current.document_id}`}>{current.title || "Untitled Document"}</a>
            </td>
          </tr>
        ) )}
        </tbody>
      </table>

    )
  }

  return (
    <div>
      <UserHeader jwt={jwt} email={getSession("EMAIL")} handleSignout={handleSignout} />
      <div className="m-2">
        { displayDocumentList(documents) }
        </div>
    </div>
  )
}

export function DynamicConnected() {
  const [documents, setDocuments] = useState<Document[]>([])

  const jwt = getSession('TOKEN')

  useEffect( () => {
    async function fetchData() {
      if (jwt) {
        const rawDocuments = await Document.getDocuments(jwt!, Env.Beta)
      // TODO: don't lock this into beta
        setDocuments(rawDocuments)
      }
    }
    fetchData()
  }, [jwt])

  return <Dynamic documents={documents}/>
}
