
import type { RemarkNodeType } from './RemarkNodeType'
const R = require('ramda')

class MarkdownNode {
    parent   : ?MarkdownNode
    text     : ?string
    children : Array<MarkdownNode>
    remarkNode : ?RemarkNodeType

    constructor(nodeIn : ?RemarkNodeType) {
        this.remarkNode = nodeIn
        this.children = []
    }


    get depth(): number {
        if (this.remarkNode) {
            return this.remarkNode.depth
        } else {
            return 0
        }
    }


    // returns a unique but not too foreign looking node ID for GraphViz
    get graphvizNodeName(): string {
        let ourText = ( this.text || "" ).slice().replace(/ /g, "_" ) // replaceAll is in ECMAScript 2021

        return `${ourText}_${this.depth}`  // TODO: might not be unique enough if we have "hello world" all on level 2s
    }


    extractTextFromRemarkNodeType( input : RemarkNodeType ): ?string {
        let extractedText = input.children[0].value

        this.text = extractedText
        return extractedText
    }


    findParentAtLevel(ancestorLevel: number): ?MarkdownNode {
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


    static  organizeHeadingEntries(thingsIn: Array<RemarkNodeType>): MarkdownNode {
        let root = new MarkdownNode()

        let currentParent = root

        for (let current: RemarkNodeType of thingsIn) {
            // TODO: ewww

            if (current.type == "heading") {
                let transformed = new MarkdownNode(current)

                transformed.extractTextFromRemarkNodeType(current)
                let depthParentExpectsTheirChildrenToBe = currentParent.depth + 1

                // went from a H1 -> H2
                if (current.depth > depthParentExpectsTheirChildrenToBe) {

                    currentParent = R.last(currentParent.children)
                    transformed.parent = currentParent

                    currentParent.children.push(transformed)
                }

                // went from H2 -> H2
                if ( current.depth == depthParentExpectsTheirChildrenToBe ) {
                    let parentOfThisNewNode = currentParent.parent || root

                    parentOfThisNewNode.children.push(transformed)
                    transformed.parent = parentOfThisNewNode
                }

                // went from H3 -> H1
                if (current.depth < depthParentExpectsTheirChildrenToBe) {
                    let parentForThisItem = currentParent.findParentAtLevel( current.depth - currentParent.depth ) || root
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
