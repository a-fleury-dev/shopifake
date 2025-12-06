import type {UUID} from "node:crypto";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface User {
    id: UUID;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokensResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    scope: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: string;
  scope: string;
}

export interface RefreshRequest {
    accessToken: string;
    refreshToken: string;
}

export interface LogoutRequest {
    accessToken: string;
    refreshToken: string;
}