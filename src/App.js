import './App.css';

import React, { Component } from 'react'
import type { Ref, Node } from 'react'
import SafeGraphvizRender from './SafeGraphvizRender'
import { Graphviz } from 'graphviz-react'

type State = {
    graphvizStr : string
}

class App extends Component< {}, State> {
    state : State = {
        graphvizStr: `graph { "hi" }`
    }

    graphvizTextArea : { current: null | HTMLTextAreaElement }  // WTF : https://stackoverflow.com/q/50076176/224334
    safeGraphViz     : { current: null | SafeGraphvizRender }

    constructor(props: any) {
        super(props)

        this.graphvizTextArea = React.createRef()
        this.safeGraphViz     = React.createRef()

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


    // <header className="App-header">
    //  <p>Edit <code>src/App.js</code> and save to reload.</p>
    // </header>

    render() : Node {
        return (
            <div className="App">
                <section>
                    <div>
                        <textarea ref={this.graphvizTextArea}
                                        id="graphviz-input" cols="80" style={{height: "15em"}}
                                        >{this.state.graphvizStr}</textarea>
                        <button onClick={this._transferGraphvizTextToState}>Render</button>
                    </div>
                    <div>
                        { /* ARGGHH this will STILL show the error overlay in dev mode, even
                             though we actually handle the error.
                             https://github.com/facebook/create-react-app/issues/3627
                             RPW 12/10/2020
                          */
                        }
                        <SafeGraphvizRender ref={this.safeGraphViz}>
                            <Graphviz dot={this.state.graphvizStr} />
                        </SafeGraphvizRender>
                    </div>
                </section>
            </div>
        )
    }
}

export default App;
