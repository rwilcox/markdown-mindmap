'use client'

import { useState } from 'react'

import { GraphvizRenderer } from '@yozora/react-code-renderer-graphviz'
import MonacoEditor from '@monaco-editor/react'
import { remark } from 'remark'

import MarkdownNode from '@/models/MarkdownNode'

export type EditorProps = {
  isAuthenticated: boolean;
  handleSave: (markdownStr: string, graphvizStr: string) => void
}

export function Editor(props: EditorProps) {
  const code = `digraph test {
    hi
  }
 `
  const [graphvizCode, setGraphVizCode]         = useState(code)                               // value of the graphviz editor
  const [graphvizText, setGraphvizText]         = useState(code)                               // text behind the graphviz RENDER
  const [error, setError]                       = useState<string | null>(null)                // graphviz compliation errors
  const [markdownText, setMarkdownText]         = useState<string | undefined>("My document")  // markdown
  const [graphOrientation, setGraphOrientation] = useState("TB")

  const editorOptions = {
    minimap: { enabled: false },
    lineNumbers: "off",
    // theme: 'hc-light'
  }

  function handleGraphvizTextChange(value: string|undefined) {
    if (value) setGraphvizText(value)
  }

  function handleRenderGraphviz() {
    setError("") // clear error from potentially last time
    setGraphVizCode( graphvizText )
  }

  function handleMarkdownToGraphviz() {
    const markdownAST = remark().parse( markdownText )
    const m = MarkdownNode.organizeHeadingEntries(markdownAST.children)
    const generatedGVis = m.recursiveGraphvizNode()
    const validGraphviz = `digraph { \n rankdir=${graphOrientation} \n ${generatedGVis} \n }`

    setGraphvizText(validGraphviz)
  }

  function displayRenderedGraph(): JSX.Element {
    if (error) {
      return <span></span>
    } else {
      return <GraphvizRenderer code={graphvizCode} onError={setError} options={{zoom: true, fit: false}}/>
    }
  }

  function displaySaveButton(): JSX.Element {
    if (props.isAuthenticated) {
      return <button style={{marginLeft: "3em"}} className="nativeBtn" onClick={handleSave}>Save</button>
    } else {
      return <span></span>
    }
  }

  function displayDocumentTitle(): JSX.Element {
    if (props.isAuthenticated) {
      return (<div>
        <label htmlFor="documentName">Document Name</label>
                <input id="documentName" type="text" style={{border: "thin black solid"}}/>
             </div>)
    } else {
      return <span></span>
    }
  }

  function handleTogglegraphOrient() {
    const graphState = graphOrientation
       if (graphState === "LR") {
          setGraphOrientation("TB")
       } else {
          setGraphOrientation("LR")
       }
  }

  function handleSave() {
    if (props.handleSave && markdownText) {
      props.handleSave(markdownText!, graphvizCode)
    }
  }

  return (
    <div>
      {displayDocumentTitle()}
      <div className="grid grid-rows-3 gap-4">
        <div className="grid grid-cols-2"> { /* row of editors */ }
          <div className="col-span-1" style={{border: "thin black solid"}}>
            <h1>Markdown</h1>
            <MonacoEditor
              defaultValue={"hi"}
              height="45vh"
              options={editorOptions}
              language="markdown"
              onChange={setMarkdownText}
            />

            <div className="border-t-2">
              <div style={{float: "left"}}>
                <input id="graphOrient"
                  type="checkbox"
                  onClick={handleTogglegraphOrient}/>
                <label htmlFor="graphOrient">Left to Right Orientatation</label>
              </div>
              <div style={{float: "right"}}>
                <button className="nativeBtn" onClick={handleMarkdownToGraphviz}>MMD `&gt;` DOT</button>
              </div>
            </div>
          </div>
          <div className="col-span-1" style={{border: "thin black solid"}}>
            <h1>Graphviz &quot;dot&quot; language</h1>
            <MonacoEditor
              defaultValue={graphvizText}
              onChange={handleGraphvizTextChange}
              options={editorOptions}
              value={graphvizText}
              height="45vh"
            />
          </div>
        </div> { /* end row of editors */ }
        <div>
          <button className="nativeBtn" onClick={handleRenderGraphviz}>Render!</button>
          {displaySaveButton()}
          <pre>{error}</pre>
          {displayRenderedGraph()}
        </div> { /* end row of renders */ }
      </div> { /* end grid */ }
  </div>)
}
