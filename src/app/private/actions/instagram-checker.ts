'use server'

export interface InstagramCheckResult {
    success: boolean
    username?: string
    error?: string
    isSuspended?: boolean
    status?: 'Active' | 'Not Found' | 'Error' | 'Queued' | 'Scanning'
    httpCode?: number
    message?: string // New field for descriptive status message
    // Profile fields
    fullName?: string
    biography?: string
    profilePicUrl?: string
    followers?: number
    following?: number
    posts?: number
    isPrivate?: boolean
    isVerified?: boolean
}

interface InstagramUser {
    full_name: string
    biography: string
    profile_pic_url: string
    edge_followed_by?: { count: number }
    edge_follow?: { count: number }
    edge_owner_to_timeline_media?: { count: number }
    is_private: boolean
    is_verified: boolean
}

type InternalCheckResult = {
    exists: boolean
    user?: InstagramUser
    httpCode: number
    message?: string
}

async function fetchProfile(username: string, count = 0): Promise<InternalCheckResult> {
    try {
        const response = await fetch(
            `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
            {
                method: 'GET',
                headers: {
                    'X-IG-App-ID': '936619743392459',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                cache: 'no-store'
            }
        );

        const httpCode = response.status;

        if (httpCode === 404) {
            return { exists: false, httpCode, message: "User not found or suspended" };
        }

        const text = await response.text();
        if (!text) {
            return { exists: false, httpCode, message: "Empty response received" };
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            // If parsing fails, it's likely HTML (login page) or rate limit error
            return { exists: false, httpCode, message: "Invalid JSON (Likely Login/Rate Limit)" };
        }

        if (data && data.data && data.data.user) {
            return { exists: true, user: data.data.user as InstagramUser, httpCode, message: "Profile active" };
        }

        return { exists: false, httpCode, message: "No user data in valid JSON response" };
    } catch (e: unknown) {
        if (count < 3) {
            await new Promise(r => setTimeout(r, 1000 * (count + 1)));
            return await fetchProfile(username, count + 1);
        }

        const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
        return { exists: false, httpCode: 500, message: errorMessage || "Network/Unknown API Error" };
    }
}

export async function checkInstagram(username: string): Promise<InstagramCheckResult> {
    const { exists, user, httpCode, message } = await fetchProfile(username);

    if (!exists || !user) {
        return {
            success: true,
            username,
            isSuspended: true,
            status: 'Not Found',
            httpCode,
            message
        }
    }

    return {
        success: true,
        username,
        isSuspended: false,
        status: 'Active',
        httpCode,
        message,
        fullName: user.full_name,
        biography: user.biography,
        profilePicUrl: user.profile_pic_url,
        followers: user.edge_followed_by?.count,
        following: user.edge_follow?.count,
        posts: user.edge_owner_to_timeline_media?.count,
        isPrivate: user.is_private,
        isVerified: user.is_verified
    }
}
