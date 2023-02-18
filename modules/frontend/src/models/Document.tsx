interface TokenAlike {
  getJwtToken(): string
}

interface CognitoAlike {
  isValid(): boolean
  getIdToken(): TokenAlike
}

class Document {
  markdownText: string = ""
  title: string = ""

  public static async getDocuments(session: CognitoAlike) {
    if ( session.isValid() ) {

      const token = session.getIdToken().getJwtToken()
      const res = await fetch('https://api.markdown-map-beta.wilcoxd.com/rest/documents/v1/', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }})


      //token
      console.log(`Authorization: Bearer $token`)
      console.log(res)
    }
  }

  public async saveDocument(session: CognitoAlike) {
      if ( session.isValid() ) {

         const token = session.getIdToken().getJwtToken()
         const res = await fetch('https://api.markdown-map-beta.wilcoxd.com/rest/documents/v1/', {
                   method: 'POST',
                   headers: {
                                 'Authorization': token,
                                'Content-Type': 'application/json'
                                },
                   body: JSON.stringify({markdown_text_base64: btoa(this.markdownText), title: this.title})
        })
        console.log(res)
      }
   }
}

export default Document
