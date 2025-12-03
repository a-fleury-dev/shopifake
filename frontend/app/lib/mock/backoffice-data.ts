import type {
  Category,
  Product,
  AttributeDefinition,
  ProductVariant,
  VariantAttribute,
} from '../types/backoffice';

// Mock Categories (hierarchical)
export const mockCategories: Category[] = [
  {
    id: 1,
    shopId: 1,
    parentId: null,
    label: 'Vêtements',
    slug: 'vetements',
    position: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    shopId: 1,
    parentId: 1,
    label: 'Hauts',
    slug: 'hauts',
    position: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    shopId: 1,
    parentId: 1,
    label: 'Bas',
    slug: 'bas',
    position: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    shopId: 1,
    parentId: 2,
    label: 'T-Shirts',
    slug: 't-shirts',
    position: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    shopId: 1,
    parentId: 2,
    label: 'Chemises',
    slug: 'chemises',
    position: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    shopId: 1,
    parentId: 3,
    label: 'Jeans',
    slug: 'jeans',
    position: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 7,
    shopId: 1,
    parentId: null,
    label: 'Accessoires',
    slug: 'accessoires',
    position: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 1,
    categoryId: 4,
    name: 'T-Shirt Classic',
    slug: 't-shirt-classic',
    description: 'Un t-shirt classique en coton confortable',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    categoryId: 6,
    name: 'Jean Slim Fit',
    slug: 'jean-slim-fit',
    description: 'Jean moderne avec coupe ajustée',
    isActive: true,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 3,
    categoryId: 5,
    name: 'Chemise Oxford',
    slug: 'chemise-oxford',
    description: 'Chemise élégante pour toutes occasions',
    isActive: true,
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
  },
];

// Mock Attribute Definitions
export const mockAttributeDefinitions: AttributeDefinition[] = [
  {
    id: 1,
    productId: 1,
    attributeName: 'Couleur',
    position: 0,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    productId: 1,
    attributeName: 'Taille',
    position: 1,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 3,
    productId: 2,
    attributeName: 'Couleur',
    position: 0,
    createdAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 4,
    productId: 2,
    attributeName: 'Taille',
    position: 1,
    createdAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 5,
    productId: 3,
    attributeName: 'Couleur',
    position: 0,
    createdAt: '2024-01-17T00:00:00Z',
  },
  {
    id: 6,
    productId: 3,
    attributeName: 'Taille',
    position: 1,
    createdAt: '2024-01-17T00:00:00Z',
  },
];

// Mock Product Variants
export const mockProductVariants: ProductVariant[] = [
  {
    id: 1,
    productId: 1,
    sku: 'TSH-001-RED-S',
    price: 19.99,
    stock: 50,
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    productId: 1,
    sku: 'TSH-001-RED-M',
    price: 19.99,
    stock: 75,
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 3,
    productId: 1,
    sku: 'TSH-001-BLUE-S',
    price: 19.99,
    stock: 30,
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 4,
    productId: 2,
    sku: 'JNS-002-DARK-32',
    price: 59.99,
    stock: 25,
    isActive: true,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 5,
    productId: 2,
    sku: 'JNS-002-DARK-34',
    price: 59.99,
    stock: 40,
    isActive: true,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: 6,
    productId: 3,
    sku: 'SHT-003-WHITE-M',
    price: 39.99,
    stock: 60,
    isActive: true,
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
  },
];

// Mock Variant Attributes
export const mockVariantAttributes: VariantAttribute[] = [
  // T-Shirt Classic variants
  { id: 1, variantId: 1, attributeDefinitionId: 1, attributeValue: 'Rouge' },
  { id: 2, variantId: 1, attributeDefinitionId: 2, attributeValue: 'S' },
  { id: 3, variantId: 2, attributeDefinitionId: 1, attributeValue: 'Rouge' },
  { id: 4, variantId: 2, attributeDefinitionId: 2, attributeValue: 'M' },
  { id: 5, variantId: 3, attributeDefinitionId: 1, attributeValue: 'Bleu' },
  { id: 6, variantId: 3, attributeDefinitionId: 2, attributeValue: 'S' },
  // Jean Slim Fit variants
  { id: 7, variantId: 4, attributeDefinitionId: 3, attributeValue: 'Foncé' },
  { id: 8, variantId: 4, attributeDefinitionId: 4, attributeValue: '32' },
  { id: 9, variantId: 5, attributeDefinitionId: 3, attributeValue: 'Foncé' },
  { id: 10, variantId: 5, attributeDefinitionId: 4, attributeValue: '34' },
  // Chemise Oxford variants
  { id: 11, variantId: 6, attributeDefinitionId: 5, attributeValue: 'Blanc' },
  { id: 12, variantId: 6, attributeDefinitionId: 6, attributeValue: 'M' },
];

// Helper functions
export function getCategoryChildren(parentId: number | null): Category[] {
  return mockCategories.filter((cat) => cat.parentId === parentId);
}

export function getCategoryById(id: number): Category | undefined {
  return mockCategories.find((cat) => cat.id === id);
}

export function getProductsByCategory(categoryId: number): Product[] {
  return mockProducts.filter((prod) => prod.categoryId === categoryId);
}

export function getProductById(id: number): Product | undefined {
  return mockProducts.find((prod) => prod.id === id);
}

export function getAttributeDefinitionsByProduct(productId: number): AttributeDefinition[] {
  return mockAttributeDefinitions.filter((attr) => attr.productId === productId);
}

export function getVariantsByProduct(productId: number): ProductVariant[] {
  return mockProductVariants.filter((variant) => variant.productId === productId);
}

export function getVariantBySku(sku: string): ProductVariant | undefined {
  return mockProductVariants.find((variant) => variant.sku === sku);
}

export function getVariantAttributes(variantId: number): VariantAttribute[] {
  return mockVariantAttributes.filter((attr) => attr.variantId === variantId);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter((prod) => prod.name.toLowerCase().includes(lowerQuery));
}

export function hasProductsInCategory(categoryId: number): boolean {
  return mockProducts.some((prod) => prod.categoryId === categoryId);
}
