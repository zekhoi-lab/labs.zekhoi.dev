// Dashboard search: every whitespace-separated term must appear in the tool's
// title or description, ignoring case
export function filterTools<T extends { title: string; description: string }>(tools: T[], query: string): T[] {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (terms.length === 0) return tools

    return tools.filter(tool => {
        const haystack = `${tool.title} ${tool.description}`.toLowerCase()
        return terms.every(term => haystack.includes(term))
    })
}
