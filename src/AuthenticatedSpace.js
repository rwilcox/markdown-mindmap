import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import { AmplifySignOut } from '@aws-amplify/ui-react';

import EditorArea from './EditorArea'

type User = {
    username: string
}
type State = {
    currentUser : User
}

/*
  This component is meant to abstract user state management from our identify provider
*/
class AuthenticatedSpace extends Component< {}, State > {
    state : State = {
        currentUser: {username: ''}
    }

    constructor(props: any) {
        super(props)


    }


    componentDidMount() {
        // can't call setState until component is mounted
        Auth.currentUserInfo().then( (currUser: object) => {
            this.setState( {'currentUser': currUser } )
        })
    }


    render(): Node {
        return (
            <div>
                <p>{ `Hello, ${this.state.currentUser.username}` }</p>
                <AmplifySignOut />
                <EditorArea />
            </div>
        )
    }

}

export default AuthenticatedSpace
