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
 * Create a new category
 */
export async function createCategory(
  shopId: number,
  data: { label: string; parentId?: number | null; position?: number }
): Promise<CategoryDTO> {
  const response = await fetch(API_CONFIG.endpoints.categories.create(shopId), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create category: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a category
 */
export async function updateCategory(
  shopId: number,
  categoryId: number,
  data: { label: string; parentId?: number | null; position?: number }
): Promise<CategoryDTO> {
  const response = await fetch(API_CONFIG.endpoints.categories.update(shopId, categoryId), {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update category: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * PRODUCTS
 */

/**
 * Fetch all products of a shop
 */
export async function fetchProductsByShop(shopId: number): Promise<ProductDTO[]> {
  const response = await fetch(API_CONFIG.endpoints.products.byShop(shopId), {
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
 * Create a new product
 */
export async function createProduct(
  shopId: number,
  data: {
    categoryId: number;
    shopId: number;
    name: string;
    description?: string;
    isActive?: boolean;
    attributeDefinitions?: Array<{ attributeName: string; position?: number }>;
  }
): Promise<ProductDTO> {
  const response = await fetch(API_CONFIG.endpoints.products.create(shopId), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create product: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a product
 */
export async function updateProduct(
  shopId: number,
  productId: number,
  data: { name: string; description?: string; isActive?: boolean }
): Promise<ProductDTO> {
  const response = await fetch(API_CONFIG.endpoints.products.update(shopId, productId), {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.status} ${response.statusText}`);
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
 * Create a new variant
 * attributes: Map where key is attributeDefinitionId and value is attributeValue
 */
export async function createVariant(
  shopId: number,
  data: {
    productId: number;
    shopId: number;
    sku: string;
    price: number;
    stock: number;
    isActive?: boolean;
    attributes: Record<number, string>; // Map<attributeDefinitionId, attributeValue>
  }
): Promise<ProductVariantDTO> {
  const response = await fetch(API_CONFIG.endpoints.variants.create(shopId), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create variant: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a variant
 * Note: attributes cannot be modified after creation
 */
export async function updateVariant(
  shopId: number,
  variantId: number,
  data: {
    sku: string;
    price: number;
    stock: number;
    isActive?: boolean;
  }
): Promise<ProductVariantDTO> {
  const response = await fetch(API_CONFIG.endpoints.variants.update(shopId, variantId), {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update variant: ${response.status} ${response.statusText}`);
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

/**
 * STOCK MANAGEMENT
 */

export interface StockActionDTO {
  id: number;
  sku: string;
  actionType: 'ADD' | 'REMOVE';
  quantity: number;
  createdAt: string;
}

export interface StockSummaryDTO {
  totalUnits: number;
  totalValue: number;
  recentActions: StockActionDTO[];
}

/**
 * Perform a stock action (ADD or REMOVE)
 */
export async function performStockAction(
  shopId: number,
  data: {
    sku: string;
    actionType: 'ADD' | 'REMOVE';
    quantity: number;
  }
): Promise<void> {
  const response = await fetch(API_CONFIG.endpoints.stock.action(shopId), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to perform stock action: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch stock summary with recent actions history
 */
export async function fetchStockSummary(shopId: number): Promise<StockSummaryDTO> {
  const response = await fetch(API_CONFIG.endpoints.stock.summary(shopId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stock summary: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
