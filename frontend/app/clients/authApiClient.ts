/**
 * Shop API Client
 * Handles all HTTP requests to the shop service
 */

import { API_CONFIG } from '../config/api';
import type {
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    Tokens,
    TokensResponse,
    User
} from "../lib/types/auth";

/**
 * Register a new user
 */
export async function register(request: RegisterRequest): Promise<User> {
    const response = await fetch(API_CONFIG.endpoints.auth.register(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch shops: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Login a user
 */
export async function login(request: LoginRequest): Promise<Tokens> {
    console.log('Login request:', request);

    const response = await fetch(API_CONFIG.endpoints.auth.login(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        throw new Error(`Failed to login: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const res: TokensResponse = await response.json() as unknown as TokensResponse;
    const now = Date.now();
    return {
        accessToken: res.accessToken,
        refreshToken : res.refreshToken,
        expiresAt : now.valueOf() + (res.expiresIn * 1000),
        tokenType: res.tokenType,
        scope: res.scope
    }
}

/**
 * Refresh the token of a logged-in user
 */
export async function refresh(request: RefreshRequest): Promise<Tokens> {
    const response = await fetch(API_CONFIG.endpoints.auth.refresh(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
    }

    const res: TokensResponse = await response.json() as unknown as TokensResponse;
    const now = Date.now();
    return {
        accessToken: res.accessToken,
        refreshToken : res.refreshToken,
        expiresAt : now.valueOf() + (res.expiresIn * 1000),
        tokenType: res.tokenType,
        scope: res.scope
    }
}

/**
 * Logout a user
 */
export async function logout(request: LogoutRequest): Promise<void> {
    const response = await fetch(API_CONFIG.endpoints.auth.logout(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (response.status !== 204) {
        throw new Error(`Failed to logout: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get the user profile
 */
export async function getLoggedUser(accesToken: string): Promise<User> {
    const response = await fetch(API_CONFIG.endpoints.auth.user(), {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + accesToken,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return response.json();
}
