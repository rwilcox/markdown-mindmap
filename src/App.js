import './App.css';

import React, { Component } from 'react'
import SafeGraphvizRender from './SafeGraphvizRender'
import { Graphviz } from 'graphviz-react'

type State = {
    graphvizStr : string
}

class App extends Component< {}, State> {
    state = {
        graphvizStr: `graph { "hi" }`
    }

    graphvizTextArea : ?HTMLTextAreaElement
    safeGraphViz     : ?SafeGraphvizRender

    constructor(props) {
        super(props)

        this.graphvizTextArea = React.createRef()
        this.safeGraphViz     = React.createRef()
    }


    transferGraphvizTextToState = (evt: SyntheticEvent<HTMLButtonElement>) => {
        if (this.graphvizTextArea !== null) {
            let dot = this.graphvizTextArea.current.value

            this.safeGraphViz.current.resetError()
            this.setState( {graphvizStr: dot})
        }
    }

    // <header className="App-header">
    //  <p>Edit <code>src/App.js</code> and save to reload.</p>
    // </header>
 
    render() {
        return (
            <div className="App">
                <section>
                    <div>
                        <textarea ref={this.graphvizTextArea}
                                        id="graphviz-input" cols="80" style={{height: "15em"}}
                                        >{this.state.graphvizStr}</textarea>
                        <button onClick={this.transferGraphvizTextToState}>Render</button>
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
