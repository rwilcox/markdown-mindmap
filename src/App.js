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
                <details style={{marginLeft: '2em', marginTop: '0.5em', backgroundColor: 'cornsilk', marginRight: '2em'}}>
                  <summary>About markdown mindmapper</summary>
                <p>This writer tool is to help you translate outlines into mind maps</p>
                <p>I like to look at my writing in several ways: I may start with an outline but want
            to see it graphically in a mindmap.</p>
                <p>With Markdown (<a href="https://www.markdownguide.org/cheat-sheet" target="blank">Cheatsheet</a>)
            and Graphviz (<a href="https://graphs.grevian.org/example" target="__blank">Cheatsheet</a>) we have two tastes that taste better together</p>
                <p>We parse your Markdown document like an outline: that heading level 1 is a main point, that the heading level 2 under it is a subpoint, so on and so forth. Then we translate that outline structure to a GraphViz graph, and render that.</p>
                <p>I find that when looking at the graph I see relationships I did not see before. I mindmap using the generated graph, adding subpoints and making connections. After my brainstorming is done I edit the markdown source with the connections I made in graph mode</p>
                <p>Zoom in or out with your mouse wheel, and use your mouse to grab/move the graph.</p>
                <p>Watch more about <a href="https://www.youtube.com/watch?v=Wn18xcM0GeI" target="__blank">brainstorming with Graphviz</a></p>
                </details>

                <div style={{height: '20em'}}>
                  <div style={{float: "left", width: '50%'}}>
                    <h1>Markdown</h1>
                    <textarea ref={this.markdownTextArea} cols="80" style={{height: "15em"}}></textarea>
                    <button onClick={this._generateGraphFromMarkdown} style={{display: 'block'}}>MMD -> DOT</button>
                  </div>
                <div style={{float: 'right', width: '49%'}}>
                       <h1>Graphviz "dot" language</h1>
                       <textarea ref={this.graphvizTextArea}
                                        id="graphviz-input" cols="80" style={{height: "15em"}}
                                        >{this.state.graphvizStr}</textarea>
                       <button onClick={this._transferGraphvizTextToState} style={{display: 'block'}}>Render</button>
                  </div>
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
