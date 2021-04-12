import React, { Component } from 'react'

import { Auth, Hub } from 'aws-amplify'


type State = {
    show       : boolean
}

class UnauthenticatedSpace extends Component<{}, State> {
    state : State = {
        show: true
    }

    constructor(props) {
        super(props)

        Hub.listen('auth', (data) => {
            if (data.payload.event === 'signIn') {
                this.setState( {show: false} )
            }

            if (data.payload.event === 'signOut') {
                this.setState( {show: true})
            }
        })
    }

    componentDidMount() {
        // can't call setState until component is mounted
        Auth.currentUserInfo().then( (currUser: object) => {
            if (currUser !== null) this.setState( {'show': false } )
        })
    }

    render(): Node {
        if (this.state.show) {
            return <div>UnauthenticatedSpace!</div>
        } else {
            return <span></span>
        }
    }
}

export default UnauthenticatedSpace
