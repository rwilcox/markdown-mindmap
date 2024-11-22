'use client'

import { useEffect, useState } from 'react'
import { Document, DocumentExport } from '@/models/Document'
import { Editor } from '@/app/components/Editor'
import { getSession} from '@/utils/session'
import { Env } from '@/config'

/// pass a POJO into this function or Next complains (?!?). Silly Next. WD-rpw 11-22-2024
export default function DocumentEditor({documentPojo}: {documentPojo: DocumentExport}) {
  // const [document, setDocument] = useState<Document>(Document.fromObject(documentPojo))

  function handleSave() {

  }

  return <Editor isAuthenticated={true} handleSave={handleSave} documentExport={documentPojo}/>
}


export function DocumentEditorConnected({documentId}: {documentId: string}) {
  const [document, setDocument] = useState<Document | undefined | null>(null)
  useEffect( () => {
    async function fetchData() {
      // TODO: don't lock into beta
      const document = await Document.getDocument(getSession('TOKEN'), Env.Beta, documentId)
      setDocument(document)
    }
    fetchData()
  })

  if (document) {
    return <DocumentEditor documentPojo={document.toObject()} />
  } else {
    return <p>Loading..</p>
  }
}
