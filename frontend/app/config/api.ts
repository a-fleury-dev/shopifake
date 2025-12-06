/**
 * API Configuration
 * Centralized configuration for API endpoints
 */
import type {UUID} from "node:crypto";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const IMAGE_SERVICE_URL = import.meta.env.VITE_IMAGE_SERVICE_URL || 'http://localhost:5002';
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:5003';

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  imageServiceUrl: IMAGE_SERVICE_URL,
  endpoints: {
    shops: {
      byAdmin: (adminId: UUID) => `${API_BASE_URL}/api/v1/shops/admin/${adminId}`,
      byId: (shopId: number) => `${API_BASE_URL}/api/v1/shops/${shopId}`,
      byDomain: (domainName: string) => `${API_BASE_URL}/api/v1/shops/domain/${domainName}`,
      create: () => `${API_BASE_URL}/api/v1/shops`,
      update: (shopId: number) => `${API_BASE_URL}/api/v1/shops/${shopId}`,
      delete: (shopId: number) => `${API_BASE_URL}/api/v1/shops/${shopId}`,
    },
    images: {
      uploadStoreBanner: (storeId: string) => `${IMAGE_SERVICE_URL}/api/images/upload/store-banner?storeId=${storeId}`,
    },
    // Storefront API
    categories: {
      roots: (shopId: number) => `${API_BASE_URL}/api/shops/${shopId}/categories`,
      all: (shopId: number) => `${API_BASE_URL}/api/shops/${shopId}/categories/all`,
      tree: (shopId: number) => `${API_BASE_URL}/api/shops/${shopId}/categories/tree`,
      byId: (shopId: number, categoryId: number) => `${API_BASE_URL}/api/shops/${shopId}/categories/${categoryId}`,
      children: (shopId: number, categoryId: number) => `${API_BASE_URL}/api/shops/${shopId}/categories/${categoryId}/children`,
      breadcrumb: (shopId: number, categoryId: number) => `${API_BASE_URL}/api/shops/${shopId}/categories/${categoryId}/breadcrumb`,
    },
    products: {
      byCategory: (shopId: number, categoryId: number) => `${API_BASE_URL}/api/shops/${shopId}/products/by-category/${categoryId}`,
      byCategoryWithVariants: (shopId: number, categoryId: number) => `${API_BASE_URL}/api/shops/${shopId}/products/by-category/${categoryId}/with-variants`,
      allWithVariants: (shopId: number) => `${API_BASE_URL}/api/shops/${shopId}/products/with-variants`,
      byId: (shopId: number, productId: number) => `${API_BASE_URL}/api/shops/${shopId}/products/${productId}`,
    },
    variants: {
      byProduct: (shopId: number, productId: number) => `${API_BASE_URL}/api/shops/${shopId}/variants/by-product/${productId}`,
      byId: (shopId: number, variantId: number) => `${API_BASE_URL}/api/shops/${shopId}/variants/${variantId}`,
    },
    // Prêt pour d'autres services
    auth: {
        register: () => `${AUTH_SERVICE_URL}/api/v1/auth/register`,
        login: () => `${AUTH_SERVICE_URL}/api/v1/auth/login`,
        logout: () => `${AUTH_SERVICE_URL}/api/v1/auth/logout`,
        refresh: () => `${AUTH_SERVICE_URL}/api/v1/auth/refresh`,
        user: () => `${AUTH_SERVICE_URL}/api/v1/auth/user`,
        health: () => `${AUTH_SERVICE_URL}/api/v1/health`,
    },
  },
} as const;
