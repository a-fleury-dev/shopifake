/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const IMAGE_SERVICE_URL = import.meta.env.VITE_IMAGE_SERVICE_URL || 'http://localhost:5002';
const CHATBOT_SERVICE_URL = import.meta.env.VITE_CHATBOT_SERVICE_URL || 'http://localhost:8000';

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  imageServiceUrl: IMAGE_SERVICE_URL,
  chatbotServiceUrl: CHATBOT_SERVICE_URL,
  endpoints: {
    shops: {
      byAdmin: (adminId: number) => `${API_BASE_URL}/api/v1/shops/admin/${adminId}`,
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
    // Chatbot Service
    chatbot: {
      search: () => `${CHATBOT_SERVICE_URL}/search/shop`,
      chat: () => `${CHATBOT_SERVICE_URL}/chat`,
    },
    // Prêt pour d'autres services
    // auth: {
    //   login: () => `${API_BASE_URL}/api/v1/auth/login`,
    //   logout: () => `${API_BASE_URL}/api/v1/auth/logout`,
    // },
  },
} as const;
