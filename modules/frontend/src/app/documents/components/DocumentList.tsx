'use client'
import { useState, useEffect } from 'react'

import { Document } from '@/models/Document'
import { Env } from '@/config'
import { getSession } from '@/utils/session'

export default function DocumentList({documents}: {documents: Document[]}) {

  /// currently Next.js does not support dynamic routes in completely staticly generated pages
  /// see https://github.com/vercel/next.js/discussions/55393
  /// this creates a PRE RESTful CONVENTIONS URL that does work in this scenario
  function displayDocumentLink(current: Document) {
    return <a href={`/documents?id=${current.document_id}`}>{current.title || "Untitled Document"}</a>
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
              { displayDocumentLink(current) }
            </td>
          </tr>
        ) )}
        </tbody>
      </table>

    )
  }

  return displayDocumentList(documents)
}

export function DocumentListConnected() {
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

  return <DocumentList documents={documents}/>
}
