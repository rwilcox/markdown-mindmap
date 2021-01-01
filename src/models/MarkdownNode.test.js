import MarkdownNode from './MarkdownNode'

import type { RemarkNodeType } from './RemarkNodeType'

test('correctly sets sibling items as siblings when parsed', () => {

    let data : Array<RemarkNodeType> = [
        {
            type: 'heading',
            depth: 1,
            children: [
                {
                    type: 'text',
                    depth: 1,
                    children: [],
                    value: 'Headline 1'
                }
            ],
        },
        {
            type: 'heading',
            depth: 1,
            children: [
                {
                    type: 'text',
                    depth: 1,
                    children: [],
                    value: 'Headline 1, #2'
                }
            ]
        }
    ]

    let res = MarkdownNode.organizeHeadingEntries(data)

    expect(res.children.length).toBe(2)
    expect(res.children[0].text).toBe("Headline 1")
    expect(res.children[1].text).toBe('Headline 1, #2')
})


test('correctly sets sibling items as siblings when parsed', () => {

    let data : Array<RemarkNodeType> = [
        {
            type: 'heading',
            depth: 1,
            children: [
                {
                    type: 'text',
                    depth: 1,
                    children: [],
                    value: 'Headline 1'
                }
            ],
        },
        {
            type: 'heading',
            depth: 2,
            children: [
                {
                    type: 'text',
                    depth: 3,
                    children: [],
                    value: 'Headline 2, #1'
                }
            ]
        },
        {
            type: 'heading',
            depth: 3,
            children: [
                {
                    type: 'text',
                    depth: 4,
                    children: [],
                    value: 'Headline 3, #1'
                }
            ]
        },
        {
            type: 'heading',
            depth: 1,
            children: [
                {
                    type: 'text',
                    depth: 2,
                    children: [],
                    value: 'Headline 1, #2'
                }
            ]
        },
        {
            type: 'heading',
            depth: 2,
            children: [
                {
                    type: 'text',
                    depth: 2,
                    children: [],
                    value: 'Headline 2, #3'
                }
            ]
        }
    ]

    let res = MarkdownNode.organizeHeadingEntries(data)

    expect(res.children.length).toBe(2)

    // we have a headline
    expect(res.children[0].text).toBe("Headline 1")

    // we can figure out that a ## headline should go under a # headline?
    expect(res.children[0].children[0].text).toBe("Headline 2, #1")
    expect(res.children[0].children[0].children.length).toBe(1)

    // can we figure out the user has gone back UP the stack - they have stopped working on that depth in the outline and come up a couple?
    expect(res.children[1].text).toBe('Headline 1, #2')

    // ... and test that we still put that under the right parent
    expect(res.children[1].children[0].text).toBe("Headline 2, #3")
})
