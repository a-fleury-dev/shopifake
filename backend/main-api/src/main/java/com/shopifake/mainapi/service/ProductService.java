package com.shopifake.mainapi.service;

import com.shopifake.mainapi.dto.*;
import com.shopifake.mainapi.exception.BadRequestException;
import com.shopifake.mainapi.exception.ResourceNotFoundException;
import com.shopifake.mainapi.mapper.ProductMapper;
import com.shopifake.mainapi.model.AttributeDefinition;
import com.shopifake.mainapi.model.Category;
import com.shopifake.mainapi.model.Product;
import com.shopifake.mainapi.repository.AttributeDefinitionRepository;
import com.shopifake.mainapi.repository.CategoryRepository;
import com.shopifake.mainapi.repository.ProductRepository;
import com.shopifake.mainapi.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttributeDefinitionRepository attributeDefinitionRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductMapper productMapper;

    /**
     * Récupère tous les produits d'une catégorie
     */
    public List<ProductDto> getProductsByCategory(Long shopId, Long categoryId) {
        validateCategoryBelongsToShop(categoryId, shopId);
        return productRepository.findByCategoryIdOrderByName(categoryId)
                .stream()
                .map(productMapper::toDto)
                .toList();
    }

    /**
     * Récupère tous les produits d'une boutique (toutes catégories)
     */
    public List<ProductDto> getProductsByShop(Long shopId) {
        List<Long> categoryIds = categoryRepository.findByShopIdOrderByPosition(shopId)
                .stream()
                .map(Category::getId)
                .toList();

        if (categoryIds.isEmpty()) {
            return List.of();
        }

        return productRepository.findByCategoryIdInOrderByName(categoryIds)
                .stream()
                .map(productMapper::toDto)
                .toList();
    }

    /**
     * Récupère un produit par son ID
     */
    public ProductDto getProductById(Long shopId, Long productId) {
        Product product = findProductById(productId);
        validateCategoryBelongsToShop(product.getCategoryId(), shopId);
        return productMapper.toDto(product);
    }

    /**
     * Récupère les définitions d'attributs d'un produit
     */
    public List<AttributeDefinitionDto> getAttributeDefinitions(Long shopId, Long productId) {
        Product product = findProductById(productId);
        validateCategoryBelongsToShop(product.getCategoryId(), shopId);

        return attributeDefinitionRepository.findByProductIdOrderByPosition(productId)
                .stream()
                .map(productMapper::toAttributeDefinitionDto)
                .toList();
    }

    /**
     * Crée un nouveau produit
     */
    @Transactional
    public ProductDto createProduct(Long shopId, CreateProductRequest request) {
        log.info("Creating product for shop {}: {}", shopId, request.name());

        validateCategoryBelongsToShop(request.categoryId(), shopId);

        String slug = generateUniqueSlug(request.categoryId(), request.name());

        Product product = new Product();
        product.setCategoryId(request.categoryId());
        product.setShopId(request.shopId());
        product.setName(request.name());
        product.setSlug(slug);
        product.setDescription(request.description());
        product.setIsActive(request.isActive() != null ? request.isActive() : true);

        Product savedProduct = productRepository.save(product);

        // Créer les définitions d'attributs si fournies
        if (request.attributeDefinitions() != null && !request.attributeDefinitions().isEmpty()) {
            List<AttributeDefinition> attributeDefinitions = new ArrayList<>();
            for (AttributeDefinitionDto dto : request.attributeDefinitions()) {
                AttributeDefinition attrDef = productMapper.toAttributeDefinition(dto, savedProduct.getId());
                attributeDefinitions.add(attrDef);
            }
            savedProduct.setAttributeDefinitions(attributeDefinitionRepository.saveAll(attributeDefinitions));
        }

        log.info("Product created with id: {}", savedProduct.getId());
        return productMapper.toDto(savedProduct);
    }

    /**
     * Met à jour un produit (nom, description, statut actif uniquement)
     * Les attributeDefinitions ne peuvent pas être modifiés s'il existe des variants
     */
    @Transactional
    public ProductDto updateProduct(Long shopId, Long productId, UpdateProductRequest request) {
        log.info("Updating product {} for shop {}", productId, shopId);

        Product product = findProductById(productId);
        validateCategoryBelongsToShop(product.getCategoryId(), shopId);

        // Mettre à jour le nom et régénérer le slug si nécessaire
        if (!product.getName().equals(request.name())) {
            product.setName(request.name());
            String newSlug = generateUniqueSlug(product.getCategoryId(), request.name(), productId);
            product.setSlug(newSlug);
        }

        product.setDescription(request.description());
        if (request.isActive() != null) {
            product.setIsActive(request.isActive());
        }

        Product updated = productRepository.save(product);
        log.info("Product {} updated successfully", productId);

        return productMapper.toDto(updated);
    }

    /**
     * Supprime un produit (et tous ses variants en cascade)
     */
    @Transactional
    public void deleteProduct(Long shopId, Long productId) {
        log.info("Deleting product {} for shop {}", productId, shopId);

        Product product = findProductById(productId);
        validateCategoryBelongsToShop(product.getCategoryId(), shopId);

        productRepository.delete(product);
        log.info("Product {} deleted successfully", productId);
    }

    // ========== Méthodes privées ==========

    private Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", productId));
    }

    private void validateCategoryBelongsToShop(Long categoryId, Long shopId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "id", categoryId));

        if (!category.getShopId().equals(shopId)) {
            throw new BadRequestException("La catégorie n'appartient pas à cette boutique");
        }
    }

    private String generateUniqueSlug(Long categoryId, String name) {
        return generateUniqueSlug(categoryId, name, null);
    }

    private String generateUniqueSlug(Long categoryId, String name, Long excludeProductId) {
        String baseSlug = slugify(name);
        String slug = baseSlug;
        int counter = 1;

        while (true) {
            if (excludeProductId != null) {
                if (!productRepository.existsByCategoryIdAndSlugAndIdNot(categoryId, slug, excludeProductId)) {
                    break;
                }
            } else {
                if (!productRepository.existsByCategoryIdAndSlug(categoryId, slug)) {
                    break;
                }
            }
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }

    private String slugify(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String slug = normalized.replaceAll("\\p{M}", "");
        slug = slug.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");

        return slug;
    }
}

