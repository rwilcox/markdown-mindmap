type RemarkNodeType = {
    type: string,
    children?: Array<RemarkNodeType>,
    depth?: number,  // how many ##s the heading has
    value?: string
}

export type {RemarkNodeType}
