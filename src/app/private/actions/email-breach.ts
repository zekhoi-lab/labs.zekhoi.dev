'use server'


export interface BreachSource {
    name: string
    date: string
    data: string[]
}

export interface EmailBreachResult {
    success: boolean
    breached: boolean
    count: number
    sources: BreachSource[]
    error?: string // Optional error field for catch block
}

export async function checkEmailBreach(email: string): Promise<EmailBreachResult> {
    // In a real app, this would query HaveIBeenPwned API or similar
    await new Promise(r => setTimeout(r, 1500))

    // Deterministic simulation based on email length
    const isBreached = email.length % 2 === 0

    if (isBreached) {
        return {
            success: true,
            breached: true,
            count: 3,
            sources: [
                { name: 'LinkedIn', date: '2021-06-22', data: ['Email', 'Passwords'] },
                { name: 'Adobe', date: '2013-10-04', data: ['Email', 'Password Hints'] },
                { name: 'Canva', date: '2019-05-24', data: ['Email', 'Names', 'Cities'] }
            ]
        }
    } else {
        return {
            success: true,
            breached: false,
            count: 0,
            sources: []
        }
    }
}
