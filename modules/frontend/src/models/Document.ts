import { Env } from '@/config'
export class Document {
  markdownText: string = ""
  graphvizText: string = ""
  title: string = ""
  currentEnv: Env = Env.Beta

  public static async getDocuments(idToken: string, env: Env) {
    const res = await fetch(`https://api.markdown-map${env}.wilcoxd.com/rest/documents/v1/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    })

    // TODO: unpack the results into Document objects including Base 64 de-conversion
    return await res.json()
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
