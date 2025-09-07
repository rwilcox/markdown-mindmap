import { Env } from '@/config'
import { Maybe } from '@/utils/FunctionalTypes';

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

export type DocumentImport = {
  document_id: Maybe<string>;
  markdown_text_base64: Maybe<string>;
  title: Maybe<string>;
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

  public static fromObject(documentObject: DocumentImport, env: Env): Document {
    return new Document(
      documentObject.document_id,
      atob(documentObject.markdown_text_base64 ?? ""),
      "",
      documentObject.title ?? "(Untitled)",
      env
    )
  }

  public static async getDocument(idToken: string, env: Env, documentId: string): Promise<Document | undefined> {
    const res = await fetch(`https://api.markdown-map${env}.wilcoxd.com/rest/documents/v1/${documentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    })

    const rawDoc = await res.json()
    return Document.fromObject(rawDoc, env)
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
    return rawDocs.documents.map( (rawDocument) => Document.fromObject(rawDocument, env))
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
