import React, { Component } from 'react'

import { Graphviz } from 'graphviz-react'
import SafeGraphvizRender from './SafeGraphvizRender'

import type { RemarkNodeType } from './models/RemarkNodeType'
import MarkdownNode from './models/MarkdownNode'

import { ReactCodeJar } from "react-codejar";

const remark = require('remark')
type State = {
    graphvizStr : string,
    graphOrient : string,
    markdownStr : string,
    draftGraphvizStr: string
}


class EditorArea extends Component< {}, State> {
    state : State = {
        graphvizStr: `graph { "hi" }`,
        draftGraphvizStr: `graph { "hi" }`,
        // ^^^ use and manage a "draft" because we don't want React trying to render half completed graphviz and throwing a fit
        // (which will happen if we try that). Graphviz rendering happens "only" explicitly when the render button(s) are pressed.
        // WD-rpw 08/22/2021

        graphOrient: "TB",
        markdownStr: `# hi`
    }

    safeGraphViz     : { current: null | SafeGraphvizRender }
    graphvizDisplayArea : { current: null | HTMLDivElement }

    constructor(props: any) {
        super(props)

        this.safeGraphViz     = React.createRef()
        this.graphvizDisplayArea = React.createRef()
    }


    // use this oddball declaration style because I want to preserve this binding
    // at the point of function creation (vs using _.bind at runtime).
    // apparently this is the cool new way even though it harshes my vibe.
    _transferGraphvizTextToState = (evt:  React.SyntheticEvent) => {
        this.setState( { graphvizStr: this.state.draftGraphvizStr} )
        if ( this.safeGraphViz.current ) this.safeGraphViz.current.resetError()
    }


    _generateGraphFromMarkdown = (evt: React.SyntheticEvent) => {
        let markdownStr = this.state.markdownStr

        let markdownAST: RemarkNodeType = remark().parse(markdownStr)
        let output: MarkdownNode | null = null
        try {
            output = MarkdownNode.organizeHeadingEntries(markdownAST.children)
        } catch (err) {
            alert("Error when parsing Markdown")   // TODO: import an error console compontent...
            //console.error(err)
            return
        }
        let generatedGraphStr = output.recursiveGraphvizNode()
        //console.dir( markdownAST )

        let validgraphViz = `digraph { \n rankdir=${this.state.graphOrient}\n ${generatedGraphStr} \n}`
        this.setState({graphvizStr: validgraphViz})
        this.setState({draftGraphvizStr: validgraphViz})
    }


    _getWidthForGraphvizRender = () => {
        if (this.graphvizDisplayArea && (this.graphvizDisplayArea.current !== null) ) {
            let graphvizArea = this.graphvizDisplayArea.current.clientWidth

            return graphvizArea
        }
        return 500
    }



    _toggleGraphOrient = () => {
       let graphState = this.state.graphOrient
       if (graphState === "LR") {
          this.setState( {graphOrient: "TB"} )
       } else {
          this.setState( {graphOrient: "LR"} )
       }
    }


    render() {
        let editorStyling = {background: "#fdf6e3", color: "#657b83",
                                                  border: "thin black solid", height: "20em"}

        let markdownTextArea = <ReactCodeJar code={this.state.markdownStr}
                              lineNumbers={true}

                              highlight={ (x) => {} }
                              onUpdate={ (x) => { this.setState({markdownStr: x}) } }

                              style={editorStyling}
                              />

        let graphvizTextArea = <ReactCodeJar code={this.state.draftGraphvizStr}
                              lineNumbers={true}
                              highlight={ (x) => {} }
                              onUpdate={ (x) => {this.setState({draftGraphvizStr: x})} }
                              style={editorStyling} />

        return (
            <div className="App">

                <div style={{height: '20em'}}>
                  <div style={{float: "left", width: '50%'}}>
                    <h1>Markdown</h1>
                    <div>{markdownTextArea}</div>
                    <button onClick={this._generateGraphFromMarkdown} style={{display: 'block'}}>MMD `&gt;` DOT</button>
                    <input id="graphOrient" type="checkbox" onClick={this._toggleGraphOrient}/><label htmlFor="graphOrient">Left to Right Orientatation</label>
                  </div>
                <div style={{float: 'right', width: '49%'}}>
                       <h1>Graphviz "dot" language</h1>
                       <div>{graphvizTextArea}</div>
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
            </div>
        )
    }
}

export default EditorArea;
