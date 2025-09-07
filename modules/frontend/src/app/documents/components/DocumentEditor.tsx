'use client'

import { useEffect, useState } from 'react'
import { Document, DocumentExport } from '@/models/Document'
import { Editor } from '@/app/components/Editor'
import { getSession} from '@/utils/session'
import { Env } from '@/config'

type HandleSaveFunction = (m: string, g: string, t: string) => void

/// pass a POJO into this function or Next complains (?!?). Silly Next. WD-rpw 11-22-2024
export default function DocumentEditor({documentPojo, handleSave}: {documentPojo: DocumentExport, handleSave: HandleSaveFunction}) {
  // const [document, setDocument] = useState<Document>(Document.fromObject(documentPojo))

  return <Editor isAuthenticated={true} handleSave={handleSave} documentExport={documentPojo}/>
}


export function DocumentEditorConnected({documentId}: {documentId: string}) {
  const [document, setDocument] = useState<Document | undefined | null>(null)

  function handleSave(markdownStr: string, graphvizStr: string, title: string) {
    document!.markdownText = markdownStr
    document!.graphvizText = graphvizStr
    document!.title = title

    document!.saveDocument(getSession('TOKEN'))
  }

  useEffect( () => {
    async function fetchData() {
      // TODO: don't lock into beta
      const document = await Document.getDocument(getSession('TOKEN'), Env.Beta, documentId)
      setDocument(document)
    }
    fetchData()
  }, [documentId])

  if (document) {
    return <DocumentEditor documentPojo={document.toObject()} handleSave={handleSave} />
  } else {
    return <p>Loading..</p>
  }
}
