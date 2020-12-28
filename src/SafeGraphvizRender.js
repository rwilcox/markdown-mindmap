
import React, { Component } from 'react'
import type { Node } from 'react'

type SafeGraphVizRenderState = {
    errorMessage: ?string
}

type Props = {
  children?: Node,
};

type GraphVizError = (Error | string) // errors from graphviz-react can be just strings. ARRGHH

class SafeGraphvizRender extends Component< Props, SafeGraphVizRenderState > {
    dotString: string
    state : SafeGraphVizRenderState = {
        errorMessage: ""
    }


    resetError() {
        this.setState( { errorMessage: ""} )
    }


    _messageForGraphVizError(error: GraphVizError): String {
        if ( typeof error == 'string' ) {
            return error
        } else {
            return error.message
        }
    }


    componentDidCatch(error: GraphVizError) {
        this.setState( {errorMessage: this._messageForGraphVizError(error) } )
    }


    static getDerivedStateFor(error: GraphVizError) : SafeGraphVizRenderState {
        return { errorMessage: this._messageForGraphVizError(error) }
    }


    render() : Node {
        if (this.state.errorMessage) {
            if (this.state.errorMessage.length > 0) {
                return <p>{this.state.errorMessage}</p>
            }
        }

        let output : Node

        if ( this.props.children ) {
            output =  this.props.children
        } else {
            output = <div>Impossible</div>
        }

        return output
    }
}

export default SafeGraphvizRender
