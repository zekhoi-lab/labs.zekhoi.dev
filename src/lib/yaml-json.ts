import { parse, stringify, YAMLParseError } from 'yaml'
import { locateJsonError } from '@/lib/json-error'

export type ConversionResult =
    | { ok: true; output: string }
    | { ok: false; error: string; line: number | null; column: number | null }

export function yamlToJson(text: string, indent: number): ConversionResult {
    if (!text.trim()) return { ok: true, output: '' }
    try {
        return { ok: true, output: JSON.stringify(parse(text), null, indent) }
    } catch (e) {
        if (e instanceof YAMLParseError) {
            // The message continues with a code excerpt; the first line is the summary
            const position = e.linePos?.[0]
            return { ok: false, error: e.message.split('\n')[0].replace(/:$/, ''), line: position?.line ?? null, column: position?.col ?? null }
        }
        return { ok: false, error: e instanceof Error ? e.message : String(e), line: null, column: null }
    }
}

export function jsonToYaml(text: string, indent: number): ConversionResult {
    if (!text.trim()) return { ok: true, output: '' }
    try {
        return { ok: true, output: stringify(JSON.parse(text), { indent }) }
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        const location = locateJsonError(message, text)
        return { ok: false, error: message, line: location?.line ?? null, column: location?.column ?? null }
    }
}
