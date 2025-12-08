import {createContext, useContext, useState, useEffect, type ReactNode} from "react";
import type {LoginRequest, LogoutRequest, RefreshRequest, Tokens, User} from "../lib/types/auth";
import { login as apiLogin, logout as apiLogout, refresh as apiRefresh, getLoggedUser as apiGetLoggedUser, register as apiRegister} from '../clients/authApiClient'

interface AuthContextType {
    tokens: Tokens | null;
    user: User | null;
    login: (request: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    getUserData: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKENS_STORAGE_KEY = 'shopifake_tokens';
const USER_STORAGE_KEY = 'shopifake_user';

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [tokens, setTokens] = useState<Tokens | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load tokens and user from localStorage on mount
    useEffect(() => {
        const loadFromStorage = () => {
            try {
                const storedTokens = localStorage.getItem(TOKENS_STORAGE_KEY);
                const storedUser = localStorage.getItem(USER_STORAGE_KEY);

                if (storedTokens) {
                    const parsedTokens = JSON.parse(storedTokens) as Tokens;
                    // Check if token is expired
                    if (parsedTokens.expiresAt && parsedTokens.expiresAt > Date.now()) {
                        setTokens(parsedTokens);
                    } else {
                        // Token expired, clear storage
                        localStorage.removeItem(TOKENS_STORAGE_KEY);
                        localStorage.removeItem(USER_STORAGE_KEY);
                    }
                }

                if (storedUser) {
                    setUser(JSON.parse(storedUser) as User);
                }
            } catch (error) {
                console.error('Failed to load auth data from storage:', error);
                localStorage.removeItem(TOKENS_STORAGE_KEY);
                localStorage.removeItem(USER_STORAGE_KEY);
            } finally {
                setIsLoading(false);
            }
        };

        loadFromStorage();
    }, []);

    // Save tokens to localStorage whenever they change
    useEffect(() => {
        if (tokens) {
            localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
        } else {
            localStorage.removeItem(TOKENS_STORAGE_KEY);
        }
    }, [tokens]);

    // Save user to localStorage whenever they change
    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    }, [user]);

    const login = async (request: LoginRequest) => {
        const newTokens = await apiLogin(request);
        setTokens(newTokens);
    }

    const logout = async () => {
        const currentTokens = tokens;
        if (currentTokens) {
            try {
                await apiLogout({ refreshToken: currentTokens.refreshToken, accessToken: currentTokens.accessToken});
            } catch (error) {
                console.error('Logout API call failed:', error);
            }
        }
        setTokens(null);
        setUser(null);
        localStorage.removeItem(TOKENS_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    }

    const getUserData = async () => {
        const currentTokens = tokens;
        if (currentTokens?.accessToken) {
            try {
                const fetchedUser = await apiGetLoggedUser(currentTokens.accessToken);
                setUser(fetchedUser);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                // If we get an auth error, clear tokens
                if (error instanceof Error && error.message.includes('401')) {
                    setTokens(null);
                    setUser(null);
                }
            }
        }
    }

    const refresh = async() => {
        const currentTokens = tokens;
        if (currentTokens?.refreshToken && currentTokens?.accessToken) {
            try {
                const request: RefreshRequest = {
                    accessToken: currentTokens.accessToken,
                    refreshToken: currentTokens.refreshToken
                };
                const newTokens = await apiRefresh(request);
                setTokens(newTokens);
            } catch (error) {
                console.error('Token refresh failed:', error);
                // If refresh fails, clear auth data
                setTokens(null);
                setUser(null);
            }
        }
    }

    return (
        <AuthContext.Provider value={{ tokens, user, login, logout, refresh, getUserData, isLoading }}>
            {children}
        </AuthContext.Provider>
    );

}
