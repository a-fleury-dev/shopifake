import { AuthService } from '@/app/services';
import {config} from "@/app/utils";

const GATEWAY_URL = config.gatewayUrl;
// si on utilise pas la gateway, modifier l'enum et mettre l'url complet
// si utilisation de hooks plutot que de services, remplacer authService par un useAuth

/**
 * Available microservice prefixes
 */
export enum ServicePrefix {
    TRANSACTIONS = '/transactions',
    MEETINGS = '/meetings',
    MESSAGES = '/message',
    NOTIFIER = '/notifier',
    USERS = '/users',
    NONE = '', // For endpoints that don't need a service prefix
}

export interface ApiRequestOptions extends RequestInit {
    requireAuth?: boolean;
    service?: ServicePrefix; // Add service prefix option
}

/**
 * Authenticated API client that automatically adds access tokens to requests
 */
export class ApiClient {
    /**
     * Make an authenticated request to the API
     */
    static async fetch(endpoint: string, options: ApiRequestOptions = {}): Promise<Response> {
        const { requireAuth = true, service, headers = {}, ...fetchOptions } = options;

        const requestHeaders: Record<string, string> = { ...headers as Record<string, string> };

        // Add authorization header if authentication is required
        if (requireAuth) {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                requestHeaders['Authorization'] = "";
                // ajout gestion d'erreur
                console.log ('Not authenticated');
            }
            if (accessToken) {
                // if access token expiré
                // authService.refreshToken();
                // accessToken = useAuth().accessToken;
                requestHeaders['Authorization'] = `Bearer ${accessToken}`;
            }

        }

        // Add default content type for JSON requests
        if (!requestHeaders['Content-Type'] && (fetchOptions.method === 'POST' || fetchOptions.method === 'PUT' || fetchOptions.method === 'PATCH')) {
            requestHeaders['Content-Type'] = 'application/json';
        }

        // Build URL with optional service prefix
        // Changer cette logique si on n'utilise pas la gateway
        let url: string;
        if (endpoint.startsWith('http')) {
            url = endpoint;
        } else {
            const servicePrefix = service || ServicePrefix.NONE;
            // Ensure endpoint starts with / if not empty
            const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
            url = `${GATEWAY_URL}${servicePrefix}${normalizedEndpoint}`;
        }

        return fetch(url, {
            ...fetchOptions,
            headers: requestHeaders,
        });
    }

    /**
     * Make a GET request
     */
    static async get(endpoint: string, options?: ApiRequestOptions): Promise<Response> {
        return this.fetch(endpoint, { ...options, method: "GET" });
    }

    /**
     * Make a POST request
     */
    static async post(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<Response> {
        return this.fetch(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * Make a PUT request
     */
    static async put(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<Response> {
        return this.fetch(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * Make a PATCH request
     */
    static async patch(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<Response> {
        return this.fetch(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * Make a DELETE request
     */
    static async delete(endpoint: string, options?: ApiRequestOptions): Promise<Response> {
        return this.fetch(endpoint, { ...options, method: 'DELETE' });
    }
}