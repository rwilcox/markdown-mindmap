import React, { Component } from 'react'

import { Auth, Hub } from 'aws-amplify'
import EditorArea from './EditorArea'

type State = {
    show       : boolean
}

class UnauthenticatedSpace extends Component<{}, State> {
    state : State = {
        show: true,
        annonEditor: false
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


    _showAnonEditor = (evt: SyntheticEvent<HTMLButtonElement>) => {
        this.setState( {annonEditor: !this.state.annonEditor} )
    }


    componentDidMount() {
        // can't call setState until component is mounted
        Auth.currentUserInfo().then( (currUser: object) => {
            if (currUser !== null) this.setState( {'show': false } )
        })
    }

    render(): Node {
        if (this.state.show) {
            return <div>
                <button onClick={this._showAnonEditor}>Toggle Anonymous Mode</button>
                {this.state.annonEditor ? (<EditorArea />) : (<span></span>)}
                </div>
        } else {
            return <span></span>
        }
    }
}

export default UnauthenticatedSpace
