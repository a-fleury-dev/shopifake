package com.shopifake.mainapi.service;

import com.shopifake.mainapi.dto.CreateProductVariantRequest;
import com.shopifake.mainapi.dto.ProductVariantDto;
import com.shopifake.mainapi.dto.UpdateProductVariantRequest;
import com.shopifake.mainapi.exception.BadRequestException;
import com.shopifake.mainapi.exception.ResourceNotFoundException;
import com.shopifake.mainapi.mapper.ProductVariantMapper;
import com.shopifake.mainapi.model.*;
import com.shopifake.mainapi.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AttributeDefinitionRepository attributeDefinitionRepository;
    private final VariantAttributeRepository variantAttributeRepository;
    private final ProductVariantMapper productVariantMapper;

    /**
     * Récupère tous les variants d'un produit
     */
    public List<ProductVariantDto> getVariantsByProduct(Long shopId, Long productId) {
        Product product = findProductById(productId);
        validateProductBelongsToShop(product, shopId);

        return productVariantRepository.findByProductIdOrderById(productId)
                .stream()
                .map(productVariantMapper::toDto)
                .toList();
    }

    /**
     * Récupère un variant par son ID
     */
    public ProductVariantDto getVariantById(Long shopId, Long variantId) {
        ProductVariant variant = findVariantById(variantId);
        Product product = findProductById(variant.getProductId());
        validateProductBelongsToShop(product, shopId);

        return productVariantMapper.toDto(variant);
    }

    /**
     * Crée un nouveau variant
     */
    @Transactional
    public ProductVariantDto createVariant(Long shopId, CreateProductVariantRequest request) {
        log.info("Creating variant for product {}: {}", request.productId(), request.sku());

        Product product = findProductById(request.productId());
        validateProductBelongsToShop(product, shopId);

        // Valider le SKU unique
        if (productVariantRepository.existsBySku(request.sku())) {
            throw new BadRequestException("Un variant avec ce SKU existe déjà: " + request.sku());
        }

        // Récupérer les définitions d'attributs du produit
        List<AttributeDefinition> attributeDefinitions =
                attributeDefinitionRepository.findByProductIdOrderByPosition(request.productId());

        if (attributeDefinitions.isEmpty() && !request.attributes().isEmpty()) {
            throw new BadRequestException("Ce produit n'a pas de définitions d'attributs");
        }

        // Valider que tous les attributs requis sont fournis
        if (attributeDefinitions.size() != request.attributes().size()) {
            throw new BadRequestException(
                    "Le nombre d'attributs fournis ne correspond pas aux définitions du produit. " +
                    "Attendu: " + attributeDefinitions.size() + ", Reçu: " + request.attributes().size()
            );
        }

        // Valider que tous les IDs d'attributs existent
        for (Long attrDefId : request.attributes().keySet()) {
            boolean exists = attributeDefinitions.stream()
                    .anyMatch(def -> def.getId().equals(attrDefId));
            if (!exists) {
                throw new BadRequestException("Définition d'attribut invalide: " + attrDefId);
            }
        }

        // Valider l'unicité de la combinaison d'attributs
        validateUniqueAttributeCombination(request.productId(), null, request.attributes());

        // Créer le variant
        ProductVariant variant = new ProductVariant();
        variant.setProductId(request.productId());
        variant.setSku(request.sku());
        variant.setPrice(request.price());
        variant.setStock(request.stock());
        variant.setIsActive(request.isActive() != null ? request.isActive() : true);

        ProductVariant savedVariant = productVariantRepository.save(variant);

        // Créer les attributs du variant
        List<VariantAttribute> variantAttributes = new ArrayList<>();
        for (Map.Entry<Long, String> entry : request.attributes().entrySet()) {
            VariantAttribute va = new VariantAttribute();
            va.setVariantId(savedVariant.getId());
            va.setAttributeDefinitionId(entry.getKey());
            va.setAttributeValue(entry.getValue());
            variantAttributes.add(va);
        }
        savedVariant.setAttributes(variantAttributeRepository.saveAll(variantAttributes));

        log.info("Variant created with id: {}", savedVariant.getId());
        return productVariantMapper.toDto(savedVariant);
    }

    /**
     * Met à jour un variant
     */
    @Transactional
    public ProductVariantDto updateVariant(Long shopId, Long variantId, UpdateProductVariantRequest request) {
        log.info("Updating variant {}", variantId);

        ProductVariant variant = findVariantById(variantId);
        Product product = findProductById(variant.getProductId());
        validateProductBelongsToShop(product, shopId);

        // Valider le SKU unique si modifié
        if (!variant.getSku().equals(request.sku())) {
            if (productVariantRepository.existsBySkuAndIdNot(request.sku(), variantId)) {
                throw new BadRequestException("Un autre variant avec ce SKU existe déjà: " + request.sku());
            }
            variant.setSku(request.sku());
        }

        variant.setPrice(request.price());
        variant.setStock(request.stock());
        if (request.isActive() != null) {
            variant.setIsActive(request.isActive());
        }

        ProductVariant updated = productVariantRepository.save(variant);
        log.info("Variant {} updated successfully", variantId);

        return productVariantMapper.toDto(updated);
    }

    /**
     * Supprime un variant
     */
    @Transactional
    public void deleteVariant(Long shopId, Long variantId) {
        log.info("Deleting variant {}", variantId);

        ProductVariant variant = findVariantById(variantId);
        Product product = findProductById(variant.getProductId());
        validateProductBelongsToShop(product, shopId);

        productVariantRepository.delete(variant);
        log.info("Variant {} deleted successfully", variantId);
    }

    // ========== Méthodes privées ==========

    private ProductVariant findVariantById(Long variantId) {
        return productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant", "id", variantId));
    }

    private Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", productId));
    }

    private void validateProductBelongsToShop(Product product, Long shopId) {
        Category category = categoryRepository.findById(product.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "id", product.getCategoryId()));

        if (!category.getShopId().equals(shopId)) {
            throw new BadRequestException("Le produit n'appartient pas à cette boutique");
        }
    }

    private void validateUniqueAttributeCombination(Long productId, Long excludeVariantId, Map<Long, String> attributes) {
        // Récupérer tous les variants du produit
        List<ProductVariant> existingVariants = productVariantRepository.findByProductIdOrderById(productId);

        for (ProductVariant existingVariant : existingVariants) {
            if (excludeVariantId != null && existingVariant.getId().equals(excludeVariantId)) {
                continue;
            }

            // Comparer les attributs
            List<VariantAttribute> existingAttributes = existingVariant.getAttributes();

            if (existingAttributes.size() != attributes.size()) {
                continue;
            }

            boolean allMatch = true;
            for (VariantAttribute va : existingAttributes) {
                String providedValue = attributes.get(va.getAttributeDefinitionId());
                if (providedValue == null || !providedValue.equals(va.getAttributeValue())) {
                    allMatch = false;
                    break;
                }
            }

            if (allMatch) {
                throw new BadRequestException("Un variant avec cette combinaison d'attributs existe déjà");
            }
        }
    }
}

