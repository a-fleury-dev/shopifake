package com.shopifake.mainapi.service;

import com.shopifake.mainapi.client.ChatbotWebhookClient;
import com.shopifake.mainapi.dto.webhook.ProductVariantWebhookPayload;
import com.shopifake.mainapi.dto.webhook.WebhookProductVariantDto;
import com.shopifake.mainapi.model.Product;
import com.shopifake.mainapi.model.ProductVariant;
import com.shopifake.mainapi.model.VariantAttribute;
import com.shopifake.mainapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotWebhookService {

    private final ChatbotWebhookClient chatbotWebhookClient;
    private final ProductRepository productRepository;
    private final com.shopifake.mainapi.repository.AttributeDefinitionRepository attributeDefinitionRepository;
    private final com.shopifake.mainapi.repository.ProductVariantRepository productVariantRepository;

    /**
     * Notify chatbot service when a variant is created
     * Async and non-blocking
     */
    @Async
    @Transactional(readOnly = true)
    public void notifyVariantCreated(ProductVariant variant) {
        try {
            // Refetch variant with attributes to avoid LazyInitializationException
            ProductVariant variantWithAttributes = productVariantRepository
                    .findByIdWithAttributes(variant.getId())
                    .orElse(variant);
            
            WebhookProductVariantDto dto = buildWebhookDto(variantWithAttributes);
            ProductVariantWebhookPayload payload = ProductVariantWebhookPayload.created(dto);
            chatbotWebhookClient.sendProductVariantWebhook(payload);
            log.debug("Sent variant.created webhook for variant {}", variant.getId());
        } catch (Exception e) {
            log.error("Error sending variant.created webhook: {}", e.getMessage(), e);
        }
    }

    /**
     * Notify chatbot service when a variant is updated
     * Async and non-blocking
     */
    @Async
    @Transactional(readOnly = true)
    public void notifyVariantUpdated(ProductVariant variant) {
        try {
            // Refetch variant with attributes to avoid LazyInitializationException
            ProductVariant variantWithAttributes = productVariantRepository
                    .findByIdWithAttributes(variant.getId())
                    .orElse(variant);
            
            WebhookProductVariantDto dto = buildWebhookDto(variantWithAttributes);
            ProductVariantWebhookPayload payload = ProductVariantWebhookPayload.updated(dto);
            chatbotWebhookClient.sendProductVariantWebhook(payload);
            log.debug("Sent variant.updated webhook for variant {}", variant.getId());
        } catch (Exception e) {
            log.error("Error sending variant.updated webhook: {}", e.getMessage(), e);
        }
    }

    /**
     * Notify chatbot service when a variant is deleted
     * Async and non-blocking
     */
    @Async
    @Transactional(readOnly = true)
    public void notifyVariantDeleted(ProductVariant variant) {
        try {
            // Refetch variant with attributes to avoid LazyInitializationException
            ProductVariant variantWithAttributes = productVariantRepository
                    .findByIdWithAttributes(variant.getId())
                    .orElse(variant);
            
            WebhookProductVariantDto dto = buildWebhookDto(variantWithAttributes);
            ProductVariantWebhookPayload payload = ProductVariantWebhookPayload.deleted(dto);
            chatbotWebhookClient.sendProductVariantWebhook(payload);
            log.debug("Sent variant.deleted webhook for variant {}", variant.getId());
        } catch (Exception e) {
            log.error("Error sending variant.deleted webhook: {}", e.getMessage(), e);
        }
    }

    /**
     * Build webhook DTO from ProductVariant entity
     */
    private WebhookProductVariantDto buildWebhookDto(ProductVariant variant) {
        // Fetch product details
        Product product = productRepository.findById(variant.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found for variant " + variant.getId()));

        // Convert variant attributes to map (attribute name -> value)
        Map<String, String> attributesMap = variant.getAttributes().stream()
                .collect(Collectors.toMap(
                        attr -> {
                            // Fetch attribute definition to get the name
                            return attributeDefinitionRepository.findById(attr.getAttributeDefinitionId())
                                    .map(def -> def.getAttributeName())
                                    .orElse("Unknown");
                        },
                        VariantAttribute::getAttributeValue
                ));

        return WebhookProductVariantDto.builder()
                .id(variant.getId())
                .productId(variant.getProductId())
                .shopId(variant.getShopId())
                .sku(variant.getSku())
                .price(variant.getPrice())
                .stock(variant.getStock())
                .isActive(variant.getIsActive())
                .productName(product.getName())
                .productSlug(product.getSlug())
                .productDescription(product.getDescription())
                .categoryId(product.getCategoryId())
                .attributes(attributesMap)
                .build();
    }
}
