import React, { Component } from 'react'
import type { Ref, Node } from 'react'

import { Graphviz } from 'graphviz-react'
import SafeGraphvizRender from './SafeGraphvizRender'

import type { RemarkNodeType } from './models/RemarkNodeType'
import MarkdownNode from './models/MarkdownNode'

const remark = require('remark')
const R      = require('ramda')

// import './App.css';
// TODO: figure out how to make Babel process .css files

type State = {
    graphvizStr : string
}



class App extends Component< {}, State> {
    state : State = {
        graphvizStr: `graph { "hi" }`
    }

    graphvizTextArea : { current: null | HTMLTextAreaElement }  // WTF : https://stackoverflow.com/q/50076176/224334
    safeGraphViz     : { current: null | SafeGraphvizRender }
    markdownTextArea : { current: null | HTMLTextAreaElement }
    graphvizDisplayArea : { current: null | HTMLDivElement }

    constructor(props: any) {
        super(props)

        this.graphvizTextArea = React.createRef()
        this.safeGraphViz     = React.createRef()
        this.markdownTextArea = React.createRef()
        this.graphvizDisplayArea = React.createRef()
    }


    // use this oddball declaration style because I want to preserve this binding
    // at the point of function creation (vs using _.bind at runtime).
    // apparently this is the cool new way even though it harshes my vibe.
    _transferGraphvizTextToState = (evt: SyntheticEvent<HTMLButtonElement>) => {
        if (this.graphvizTextArea !== null) {
            if (this.graphvizTextArea.current !== null) {
                let dot = this.graphvizTextArea.current.value

                if ( this.safeGraphViz.current ) this.safeGraphViz.current.resetError()
                this.setState( {graphvizStr: dot})
            }
        }
    }


    _generateGraphFromMarkdown = (evt: SyntheticEvent<HTMLButtonElement>) => {
        if ( (this.markdownTextArea !== null) && (this.markdownTextArea.current !== null) ) {
            let markdownStr = this.markdownTextArea.current.value

            let markdownAST: RemarkNodeType = remark().parse(markdownStr)
            let output : MarkdownNode = MarkdownNode.organizeHeadingEntries(markdownAST.children)

            let generatedGraphStr = output.recursiveGraphvizNode()
            //console.dir( markdownAST )

            let validgraphViz = `digraph { \n ${generatedGraphStr} \n}`
            this.setState({graphvizStr: validgraphViz})

            // $FlowIssue[incompatible-use]
            this.graphvizTextArea.current.value = validgraphViz // TODO: ugh is this right?
        }

    }

    // <header className="App-header">
    //  <p>Edit <code>src/App.js</code> and save to reload.</p>
    // </header>


    _getWidthForGraphvizRender = () => {
        if (this.graphvizDisplayArea && this.graphvizDisplayArea.current) {
            let graphvizArea = this.graphvizDisplayArea.current.clientWidth

            return graphvizArea
        }
        return 500
    }


    render() : Node {
        let graphvizArea = 0
        return (
            <div className="App">
                <section>
                    <div>
                <textarea ref={this.markdownTextArea} cols="80" style={{height: "15em"}}></textarea>
                <button onClick={this._generateGraphFromMarkdown}>MMD -> DOT</button>
                        <textarea ref={this.graphvizTextArea}
                                        id="graphviz-input" cols="80" style={{height: "15em"}}
                                        >{this.state.graphvizStr}</textarea>
                        <button onClick={this._transferGraphvizTextToState}>Render</button>
                    </div>
                <div ref={this.graphvizDisplayArea}>
                        { /* ARGGHH this will STILL show the error overlay in dev mode, even
                             though we actually handle the error.
                             https://github.com/facebook/create-react-app/issues/3627
                             RPW 12/10/2020
                          */
                        }

                        <SafeGraphvizRender ref={this.safeGraphViz}>
                            <Graphviz dot={this.state.graphvizStr} options={{zoom: true,
                                                                 width: this._getWidthForGraphvizRender() }}/>
                        </SafeGraphvizRender>
                    </div>
                </section>
            </div>
        )
    }
}

export default App;
