
import React, { Component } from 'react'

class SafeGraphvizRender extends Component< { }, { errorMessage: ""} > {
    dotString: string
    state = {
        errorMessage: ""
    }


    resetError() {
        this.setState( { errorMessage: ""} )
    }


    componentDidCatch(error : string) {
        this.setState( {errorMessage: error} )
    }


    static getDerivedStateFor(error) {
        return { errorMessage: error }
    }


    render() {
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
