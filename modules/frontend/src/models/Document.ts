import { Env } from '@/config'

type DocumentResponse = {
  document_id: string;
  markdown_text_base64: string;
  title: string
}

export type DocumentExport = {
  document_id: string | null;
  markdownText: string;
  graphvizText: string;
  title: string;
  currentEnv: Env
}

export class Document {
  constructor(
    public document_id: string | null = "",
    public markdownText: string = "",
    public graphvizText: string = "",
    public title: string = "",
    public currentEnv: Env = Env.Beta) {}


  public toObject(): DocumentExport {
    return {
      document_id: this.document_id,
      markdownText: this.markdownText,
      graphvizText: this.graphvizText,
      title: this.title,
      currentEnv: this.currentEnv}
  }

  public static fromObject(documentObject: DocumentExport): Document {
    return new Document(
      documentObject.document_id,
      documentObject.markdownText,
      documentObject.title,
      documentObject.currentEnv
    )
  }

  public static async getDocument(idToken: string, env: Env, documentId: string): Promise<Document | undefined> {
    // TODO: need to make an individual route for documents
    // for now retrieve all documents and filter out

    const documents = await Document.getDocuments(idToken, env)
    return documents.find( (current) => current.document_id == documentId)
  }

  public static async getDocuments(idToken: string, env: Env): Promise<Document[]> {
    const res = await fetch(`https://api.markdown-map${env}.wilcoxd.com/rest/documents/v1/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    })

    const rawDocs: {documents: DocumentResponse[]} = await res.json()
    return rawDocs.documents.map( (rawDocument) => new Document(
      rawDocument.document_id,
      atob(rawDocument.markdown_text_base64),
        "",
      rawDocument.title,
      env))
  }

  public async saveDocument(idToken: string) {
    const res = await fetch(`https://api.markdown-map${this.currentEnv}.wilcoxd.com/rest/documents/v1/`, {
                   method: 'POST',
                   headers: {
                                 'Authorization':  `Bearer ${idToken}`,
                                'Content-Type': 'application/json'
                                },
                   body: JSON.stringify({markdown_text_base64: btoa(this.markdownText), title: this.title})
    })
    return await res.json()

  }

}
