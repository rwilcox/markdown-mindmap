import React, { Component } from 'react'
import { Auth } from 'aws-amplify'

import EditorArea from './EditorArea'

type User = {
    username: string
}
type State = {
    currentUser : User
}

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
                <EditorArea />
            </div>
        )
    }

}

export default AuthenticatedSpace
