import { cookies } from "next/headers";

const getBaseUrl = () => {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    // Đảm bảo luôn có /api ở cuối nếu chưa có
    if (!baseUrl.endsWith("/api")) {
        baseUrl = `${baseUrl.replace(/\/$/, "")}/api`;
    }
    return baseUrl;
};

const API_URL = getBaseUrl();

interface FetchOptions extends RequestInit {
    revalidate?: number | false;
    tags?: string[];
    skipCookies?: boolean; // New option
}

/**
 * Server-side Fetch Utility
 * Tự động xử lý Base URL, Cookies (Auth & GroupId) và Caching cho Next.js
 */
export async function serverFetch<T = any>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null }> {
    try {
        let token: string | undefined;
        let groupId: string | undefined;

        // Only try to access cookies if not explicitly skipped
        // and if we are in a request context (try-catch prevents build-time crashes)
        if (!options.skipCookies) {
            try {
                const cookieStore = await cookies();
                token = cookieStore.get("auth_token")?.value;
                groupId = cookieStore.get("group_id")?.value;
            } catch (e) {
                // cookies() was called outside a request context (e.g. during static generation)
                // This is fine for public data, we just won't have the token/groupId
            }
        }

        // Chuẩn hóa endpoint: loại bỏ /api/ ở đầu nếu có vì đã có trong API_URL
        const cleanEndpoint = endpoint.replace(/^\/?api\//, "").replace(/^\//, "");

        const url = endpoint.startsWith("http")
            ? endpoint
            : `${API_URL}/${cleanEndpoint}`;

        const headers = new Headers(options.headers);

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        if (groupId) {
            headers.set("X-Group-Id", groupId);
        }

        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        const { revalidate, tags, ...restOptions } = options;

        const start = Date.now();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

        let response;
        try {
            response = await fetch(url, {
                ...restOptions,
                headers,
                signal: controller.signal,
                next: {
                    revalidate: revalidate !== undefined ? revalidate : 3600,
                    tags: tags || [],
                },
            });
        } finally {
            clearTimeout(timeoutId);
        }

        const duration = Date.now() - start;
        const statusStr = response.ok ? 'SUCCESS' : `ERROR ${response.status}`;

        // Chỉ log slow requests hoặc errors
        if (duration > 1000 || !response.ok) {
            const level = response.ok ? 'SLOW' : 'ERROR';
        }

        if (!response.ok) {
            if (response.status === 401) {
                // Xử lý logic unauthorized nếu cần
            }
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        return { data: json.data, error: null };
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error(`[API Fetch] TIMEOUT after 5000ms: ${endpoint}`);
            return { data: null, error: "Connection Timeout" };
        }
        console.error(`[Server Fetch Error] ${endpoint}:`, error.message);
        return { data: null, error: error.message };
    }
}
