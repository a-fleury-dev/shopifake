/**
 * Transform functions to convert API DTOs to frontend types
 */

import type {
  CategoryDTO,
  CategoryTreeNodeDTO,
  CategoryTreeDTO,
  ProductDTO,
  ProductVariantDTO,
  ProductWithVariantsDTO,
} from './dto';
import type {
  Category,
  ProductVariant,
  VariantAttribute,
} from '../types/storefront';

/**
 * Category Tree Node frontend type
 */
export interface CategoryTreeNode {
  id: number;
  label: string;
  slug: string;
  position: number;
  children: CategoryTreeNode[];
}

/**
 * Category Tree frontend type
 */
export interface CategoryTree {
  children: CategoryTreeNode[];
}

/**
 * Transform CategoryDTO to Category
 */
export function transformCategory(dto: CategoryDTO): Category {
  return {
    id: dto.id,
    shopId: dto.shopId,
    parentId: dto.parentId || undefined,
    label: dto.label,
    slug: dto.slug,
    position: dto.position,
    createdAt: new Date().toISOString(), // Not in DTO
    updatedAt: new Date().toISOString(), // Not in DTO
  };
}

/**
 * Transform ProductVariantDTO with ProductDTO to ProductVariant
 * Enriches variant with product information for display
 */
export function transformVariantWithProduct(
  variantDTO: ProductVariantDTO,
  productDTO: ProductDTO
): ProductVariant {
  // Transform attributes map to VariantAttribute array
  const attributes: VariantAttribute[] = Object.entries(variantDTO.attributes).map(
    ([attributeName, attributeValue], index) => ({
      id: index, // Temporary ID
      variantId: variantDTO.id,
      attributeDefinitionId: 0, // Not available in DTO
      attributeValue,
      attributeName,
    })
  );

  return {
    id: variantDTO.id,
    productId: variantDTO.productId,
    sku: variantDTO.sku,
    price: variantDTO.price,
    stock: variantDTO.stock,
    isActive: variantDTO.isActive,
    imageUrl: undefined, // TODO: Get from image service
    createdAt: variantDTO.createdAt,
    updatedAt: variantDTO.updatedAt,
    attributes,
    // Enriched product data
    productName: productDTO.name,
    productDescription: productDTO.description,
    productSlug: productDTO.slug,
    categoryId: productDTO.categoryId,
  };
}

/**
 * Transform ProductWithVariantsDTO array to ProductVariant array
 * Flattens the structure for storefront display
 */
export function transformProductsWithVariants(
  productsWithVariants: ProductWithVariantsDTO[]
): ProductVariant[] {
  return productsWithVariants.flatMap(({ product, variants }) =>
    variants.map((variant) => transformVariantWithProduct(variant, product))
  );
}

/**
 * Transform CategoryTreeNodeDTO to CategoryTreeNode
 */
export function transformCategoryTreeNode(dto: CategoryTreeNodeDTO): CategoryTreeNode {
  return {
    id: dto.id,
    label: dto.label,
    slug: dto.slug,
    position: dto.position,
    children: dto.children.map(transformCategoryTreeNode),
  };
}

/**
 * Transform CategoryTreeDTO to CategoryTree
 */
export function transformCategoryTree(dto: CategoryTreeDTO): CategoryTree {
  return {
    children: dto.children.map(transformCategoryTreeNode),
  };
}
