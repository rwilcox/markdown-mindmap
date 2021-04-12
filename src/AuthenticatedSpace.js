import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import { AmplifySignOut } from '@aws-amplify/ui-react';

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
        Auth.currentUserInfo().then( (currUser: object) => {
            this.setState( {'currentUser': currUser, ready: true } )
        })
    }


    render(): Node {
        let output
        if (this.state.ready) {
            output = <div>
                <p>{ `Hello, ${this.state.currentUser.username}` }</p>
                <AmplifySignOut />
                <EditorArea />
            </div>
        } else {
            output = <div>Wait...</div>
        }
        return output
    }

}

export default AuthenticatedSpace
