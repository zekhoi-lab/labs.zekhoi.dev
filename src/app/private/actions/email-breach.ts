'use server'


import axios from 'axios'

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

interface xposedBreach {
    breachID: string
    breachedDate: string
    domain: string
    exposedData: string[]
    exposureDescription: string
    industry: string
    logo: string
    passwordRisk: string
    searchable: boolean
    sensitive: boolean
    verified: boolean
}

export async function checkEmailBreach(email: string): Promise<EmailBreachResult> {
    try {
        const response = await axios.get(`https://api.xposedornot.com/v1/check-email/${email}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            },
            validateStatus: (status) => status < 500 // Handle 404 as valid response
        })

        const data = response.data

        // API returns { Error: "Not found" } or 404 if no breaches
        if (response.status === 404 || (data.Error && data.Error === "Not found")) {
            return {
                success: true,
                breached: false,
                count: 0,
                sources: []
            }
        }

        // Successfully found breaches
        if (data.breaches && Array.isArray(data.breaches) && data.breaches[0] && data.breaches[0].length > 0) {
            const breachNames: string[] = data.breaches[0]

            // Fetch metadata for all breaches to enrich the result
            let allBreaches: xposedBreach[] = []
            try {
                const metadataResponse = await axios.get('https://api.xposedornot.com/v1/breaches', {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
                    }
                })
                if (metadataResponse.data && Array.isArray(metadataResponse.data.exposedBreaches)) {
                    allBreaches = metadataResponse.data.exposedBreaches
                }
            } catch (err) {
                console.warn("Failed to fetch breach details", err)
                // Continue without metadata
            }

            const sources: BreachSource[] = breachNames.map(name => {
                const details = allBreaches.find(b => b.breachID === name)

                if (details) {
                    return {
                        name: details.breachID,
                        date: details.breachedDate.split('T')[0],
                        data: details.exposedData
                    }
                }

                return {
                    name: name,
                    date: 'Unknown',
                    data: ['Unknown Data']
                }
            })

            return {
                success: true,
                breached: true,
                count: sources.length,
                sources: sources
            }
        }

        return {
            success: false,
            breached: false,
            count: 0,
            sources: [],
            error: 'Invalid API response format'
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        return {
            success: false,
            breached: false,
            count: 0,
            sources: [],
            error: errorMessage || 'Failed to connect to breach database'
        }
    }
}
