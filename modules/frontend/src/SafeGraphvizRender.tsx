
import React, { Component } from 'react'

type SafeGraphVizRenderState = {
    errorMessage?: string
}

type Props = {
  children?: React.ReactNode,
};

type GraphVizError = (Error | string) // errors from graphviz-react can be just strings. ARRGHH

class SafeGraphvizRender extends Component< Props, SafeGraphVizRenderState > {
    state : SafeGraphVizRenderState = {
        errorMessage: ""
    }


    resetError() {
        this.setState( { errorMessage: ""} )
    }


    static _messageForGraphVizError(error: GraphVizError): string {
        if ( typeof error == 'string' ) {
            return error
        } else {
            return error.message
        }
    }


    componentDidCatch(error: GraphVizError) {
        this.setState( {errorMessage: SafeGraphvizRender._messageForGraphVizError(error) } )
    }


    static getDerivedStateFor(error: GraphVizError) : SafeGraphVizRenderState {
        return { errorMessage: this._messageForGraphVizError(error) }
    }


    render() {
        if (this.state.errorMessage) {
            if (this.state.errorMessage.length > 0) {
                return <p>{this.state.errorMessage}</p>
            }
        }

        let output

        if ( this.props.children ) {
            output =  this.props.children
        } else {
            output = <div>Impossible</div>
        }

        return output
    }
}

export default SafeGraphvizRender
