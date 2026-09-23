// "30 seconds ago" / "5 minutes from now", in whole seconds, minutes, hours, or days
export function getRelativeTime(date: Date, now: Date): string {
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    const suffix = diff < 0 ? 'from now' : 'ago'
    const abs = Math.abs(diff)
    if (abs < 60) return `${abs} seconds ${suffix}`
    if (abs < 3600) return `${Math.floor(abs / 60)} minutes ${suffix}`
    if (abs < 86400) return `${Math.floor(abs / 3600)} hours ${suffix}`
    return `${Math.floor(abs / 86400)} days ${suffix}`
}
