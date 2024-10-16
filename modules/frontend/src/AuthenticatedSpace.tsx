import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import { AmplifySignOut } from '@aws-amplify/ui-react';

import Document from './models/Document'
import EditorArea from './EditorArea'

type User = {
    username: string
}
type State = {
    currentUser : User,
    ready       : boolean
}

/*
  This component is meant to abstract user state management from our identify provider
*/
class AuthenticatedSpace extends Component< {}, State > {
    state : State = {
        currentUser: {username: ''},
        ready: false
    }

    constructor(props: any) {
        super(props)
    }


    componentDidMount() {
        // can't call setState until component is mounted
        Auth.currentUserInfo().then( (currUser: User) => {
            this.setState( {'currentUser': currUser, ready: true } )
        })
    }


    _handleDocumentCreate = async (doc: Document) => {
      let session = await Auth.currentSession()

      doc.saveDocument(session)
    }
    render(): React.ReactNode {
        let output : React.ReactNode
        if (this.state.ready) {
            output = <div>
                <p>{ `Hello, ${this.state.currentUser.username}` }</p>
                <AmplifySignOut />
                <EditorArea isUserAuthed={true} handleSave={this._handleDocumentCreate}/>
            </div>
        } else {
            output = <div>Wait...</div>
        }
        return output
    }

}

export default AuthenticatedSpace
