
import React, { Component } from 'react'
import type { Node } from 'react'

class SafeGraphvizRender extends Component< { }, { errorMessage: ""} > {
    dotString: string
    state = {
        errorMessage: ""
    }


    resetError() {
        this.setState( { errorMessage: ""} )
    }


    componentDidCatch(error : Error) {
        this.setState( {errorMessage: error} )
    }


    static getDerivedStateFor(error: Error) {
        return { errorMessage: error }
    }


    render() : Node {
        if (this.state.errorMessage.length > 0) {
            return <p>{this.state.errorMessage}</p>
        }

        let output =  this.props.children
//        if ( this.state.errorMessage.length > 0) {
//            this.setState( {errorMessage: ""} ) // got this far? no error to show
//        }

        return output
    }
}

export default SafeGraphvizRender
