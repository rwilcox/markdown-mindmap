import { Env } from '@/config'

type DocumentResponse = {
  document_id: string;
  markdown_text_base64: string;
  title: string
}

export class Document {
  constructor(
    public document_id: string | null = "",
    public markdownText: string = "",
    public graphvizText: string = "",
    public title: string = "",
    public currentEnv: Env = Env.Beta) {}


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
