
import type { RemarkNodeType } from './RemarkNodeType'
import * as R from 'ramda'

class MarkdownNode {
  parent?   : MarkdownNode
  text?     : string
  children : Array<MarkdownNode>
  remarkNode? : RemarkNodeType

  constructor(nodeIn? : RemarkNodeType) {
    this.remarkNode = nodeIn
    this.children = []
  }


  get depth(): number {
    if (this.remarkNode) {
      return this.remarkNode.depth ?? 0
    } else {
      return 0
    }
  }


  asGraphvizNode() : string {
    let childrenText = `\n\n${this.graphvizNodeName} [label = "${this.text || ''}"]    // definition "${this.text || ""}"`
    if (this.children.length > 0) {
      childrenText = childrenText + `\n${this.graphvizNodeName} -> ` + ( R.map( (i: MarkdownNode) => `${i.graphvizNodeName}`, this.children ) ).join(', ')
    } else {
      childrenText = childrenText + `\n // ${this.graphvizNodeName} -> `
    }

    return childrenText
  }


    /*
               We want to generate a graphviz digram like:

                "headline 1" -> "headline 2"
                "headline 2" -> "headline 3", "headline 4"

                "headline 4" -> "headline 5"

                This seems the most regular way to generate this graph source code.
                We only want to go one deep, and assume later declarations will
                specify whatever child items are under the headline.

    */
  recursiveGraphvizNode(): string {
    const start = this.asGraphvizNode()

    const childrenOutput = []
    for (const currentChild of this.children) {
      // currentChild is MarkdownNode
      childrenOutput.push( currentChild.recursiveGraphvizNode() )
    }

    return `${start}\n${childrenOutput.join('\n')}`
  }


  // returns a unique but not too foreign looking node ID for GraphViz
  get graphvizNodeName(): string {
    const targetStr = ( this.text || "" ).slice()
    const ourText = targetStr.replace(/\W/g, "_" )    // Replace any punctuation. Also: replaceAll is in ECMAScript 2021

    return `${ourText}_${this.depth}`  // TODO: might not be unique enough if we have "hello world" all on level 2s
  }


  extractTextFromRemarkNodeType(input : RemarkNodeType): (string | null | undefined) {
    if (!input.children) { return null }

    const extractedText = input.children![0].value

    this.text = extractedText
    return extractedText
  }


  findParentAtLevel(ancestorLevel: number): (MarkdownNode | null | undefined) {
    if (ancestorLevel == 0) {
      return this.parent
    } else {
      if (this.parent) {
        return this.parent.findParentAtLevel(ancestorLevel - 1)
      } else {
        return null
      }
    }
  }


    /*
              { type: "heading",
                children: [ {
                    type: "text",
                    value: "heading 1"
                }]}

                NOTE: these are NOT embedded in each other semantically in an outline:
                it's a flat list of headlines.

    */
  static  organizeHeadingEntries(thingsIn: Array<RemarkNodeType>): MarkdownNode {
    const root = new MarkdownNode()
    root.text = "root"

    let currentParent : MarkdownNode = root

    for (const current of thingsIn) {
      // current is a RemarkNodeType
      // TODO: ewww

      if (current.type == "heading") {
        const currentDepth = current.depth ?? 0
        const transformed = new MarkdownNode(current)

        transformed.extractTextFromRemarkNodeType(current)
        let depthParentExpectsTheirChildrenToBe
        if (currentParent !== null) {
          depthParentExpectsTheirChildrenToBe = currentParent.depth + 1
        } else {
          depthParentExpectsTheirChildrenToBe = 1 // if there's no parent we must be at the top
        }

        // went from a H1 -> H2
        if (currentDepth > depthParentExpectsTheirChildrenToBe) {
          currentParent = R.last(currentParent.children)!

          transformed.parent = currentParent

          currentParent.children.push(transformed)
        }

        // went from H2 -> H2
        if (currentDepth == depthParentExpectsTheirChildrenToBe ) {
          const parentOfThisNewNode = currentParent

          parentOfThisNewNode.children.push(transformed)
          transformed.parent = parentOfThisNewNode
        }

        // went from H3 -> H1
        if (currentDepth < depthParentExpectsTheirChildrenToBe) {
          const parentForThisItem = currentParent.findParentAtLevel( currentDepth - currentParent.depth ) || root
          transformed.parent = parentForThisItem
          currentParent = parentForThisItem
          parentForThisItem.children.push(transformed)
        }

      }
    }

    return root
  }
}

export default MarkdownNode
