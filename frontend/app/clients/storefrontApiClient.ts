/**
 * Storefront API Client
 * Handles all HTTP requests for the storefront (categories, products, variants)
 */

import { API_CONFIG } from '../config/api';
import type {
  CategoryDTO,
  CategoryTreeDTO,
  ProductDTO,
  ProductVariantDTO,
  ProductWithVariantsDTO,
} from '../lib/storefront/dto';

/**
 * CATEGORIES
 */

/**
 * Fetch root categories of a shop
 */
export async function fetchRootCategories(shopId: number): Promise<CategoryDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.categories.roots(shopId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch root categories: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a category by ID
 */
export async function fetchCategoryById(shopId: number, categoryId: number): Promise<CategoryDTO> {
  const response = await fetch(API_CONFIG.endpoints.categories.byId(shopId, categoryId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch children categories of a category
 */
export async function fetchCategoryChildren(shopId: number, categoryId: number): Promise<CategoryDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.categories.children(shopId, categoryId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch category children: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch breadcrumb for a category
 */
export async function fetchCategoryBreadcrumb(shopId: number, categoryId: number): Promise<CategoryDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.categories.breadcrumb(shopId, categoryId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch category breadcrumb: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all categories (flat list)
 */
export async function fetchAllCategories(shopId: number): Promise<CategoryDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.categories.all(shopId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch all categories: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch category tree (hierarchical structure)
 */
export async function fetchCategoryTree(shopId: number): Promise<CategoryTreeDTO> {
  const response = await fetch(API_CONFIG.endpoints.categories.tree(shopId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch category tree: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * PRODUCTS
 */

/**
 * Fetch products of a category
 */
export async function fetchProductsByCategory(shopId: number, categoryId: number): Promise<ProductDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.products.byCategory(shopId, categoryId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a product by ID
 */
export async function fetchProductById(shopId: number, productId: number): Promise<ProductDTO> {
  const response = await fetch(API_CONFIG.endpoints.products.byId(shopId, productId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * VARIANTS
 */

/**
 * Fetch variants of a product
 */
export async function fetchVariantsByProduct(shopId: number, productId: number): Promise<ProductVariantDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.variants.byProduct(shopId, productId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch variants: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a variant by ID
 */
export async function fetchVariantById(shopId: number, variantId: number): Promise<ProductVariantDTO> {
  const response = await fetch(API_CONFIG.endpoints.variants.byId(shopId, variantId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch variant: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * COMBINED OPERATIONS
 */

/**
 * Fetch products with their variants for a category and all its subcategories (recursive)
 * Uses the backend endpoint that returns products from the category and all descendants
 */
export async function fetchProductsWithVariantsByCategory(
  shopId: number,
  categoryId: number
): Promise<ProductWithVariantsDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.products.byCategoryWithVariants(shopId, categoryId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products with variants: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all products with their variants for a shop (all categories)
 */
export async function fetchAllProductsWithVariants(
  shopId: number
): Promise<ProductWithVariantsDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.products.allWithVariants(shopId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch all products with variants: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
