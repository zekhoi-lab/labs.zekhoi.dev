export interface JsonErrorLocation {
    line: number
    column: number
    lineText: string
}

// Browsers word JSON.parse errors differently: current V8 and Firefox include
// "line X column Y", older V8 only "position N", and Safari gives neither
export function locateJsonError(message: string, text: string): JsonErrorLocation | null {
    let line: number
    let column: number

    const lineColumn = /line (\d+) column (\d+)/i.exec(message)
    const position = /position (\d+)/i.exec(message)
    if (lineColumn) {
        line = Number(lineColumn[1])
        column = Number(lineColumn[2])
    } else if (position) {
        const offset = Number(position[1])
        const before = text.slice(0, offset)
        line = before.split('\n').length
        column = offset - before.lastIndexOf('\n')
    } else {
        return null
    }

    const lineText = (text.split('\n')[line - 1] ?? '').replace(/\r$/, '')
    return { line, column, lineText }
}
