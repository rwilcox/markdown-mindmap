import React, { Component } from 'react'

class Header extends Component< {}, {} > {
    render(): Node {
        return  <section>
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
            </section>

    }

}

export default Header
