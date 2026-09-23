// Case conversions and text statistics. \p{…} classes keep them Unicode-aware.

// "helloWorld", "HTTPServer", "user_id" → words; digits stay attached ("version2")
export function splitWords(input: string): string[] {
    return input
        .replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, '$1 $2')
        .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean)
}

const capitalize = (word: string) => {
    const [first = '', ...rest] = [...word]
    return first.toUpperCase() + rest.join('').toLowerCase()
}

export const toCamelCase = (text: string) =>
    splitWords(text).map((word, i) => (i === 0 ? word.toLowerCase() : capitalize(word))).join('')

export const toPascalCase = (text: string) => splitWords(text).map(capitalize).join('')

export const toSnakeCase = (text: string) => splitWords(text).map(word => word.toLowerCase()).join('_')

export const toKebabCase = (text: string) => splitWords(text).map(word => word.toLowerCase()).join('-')

export const toConstantCase = (text: string) => splitWords(text).map(word => word.toUpperCase()).join('_')

// These two keep the original spacing and punctuation
export const toTitleCase = (text: string) =>
    text.toLowerCase().replace(/(^|[\s\-_/])(\p{L})/gu, (_, separator: string, letter: string) => separator + letter.toUpperCase())

export const toSentenceCase = (text: string) =>
    text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, separator: string, letter: string) => separator + letter.toUpperCase())

// ASCII-only URL slug: accents are stripped, anything else becomes a hyphen
export const slugify = (text: string) =>
    text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export interface TextStats {
    characters: number
    charactersNoSpaces: number
    words: number
    lines: number
    bytes: number
    readingMinutes: number
}

const WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu

export function textStats(text: string): TextStats {
    const words = text.match(WORD)?.length ?? 0
    return {
        // Code points, so an emoji counts once
        characters: [...text].length,
        charactersNoSpaces: [...text.replace(/\s/g, '')].length,
        words,
        lines: text === '' ? 0 : text.split(/\r\n|\r|\n/).length,
        bytes: new TextEncoder().encode(text).length,
        // At 200 words per minute, rounded, but at least a minute for any words
        readingMinutes: words === 0 ? 0 : Math.max(1, Math.round(words / 200)),
    }
}
